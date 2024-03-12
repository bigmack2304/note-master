import React, { useState, useId } from "react";
import { OutlinedInput, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useFolders } from "0-shared/hooks/useFolders";
import { NoteTag } from "0-shared/components/NoteTag/NoteTag";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { IDataTreeFolder } from "0-shared/types/dataSave";
import type { PaletteMode, SxProps, SelectChangeEvent } from "@mui/material";
import { useEventListener } from "0-shared/hooks/useEventListener";
import type { GetProps } from "0-shared/utils/typeHelpers";

type TFolderSelectProps = {
    onChange?: (tagNames: string) => void;
    sortName?: string;
    addClassNames?: string[];
    updateOnEvent?: string | string[];
    resetOnEvent?: boolean;
    size?: GetProps<typeof Select>["size"];
    defaultValue?: TSelectFOlderData;
};

type TSelectFOlderData = {
    id: string;
    name: string;
};

/**
 * выводит список всех папок
 *
 * @prop onChange функция вызывается при изменении селекта
 * @prop sortName - отображать имена пипок которые включают в себя эту подстроку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop updateOnEvent любое имя события на которое нужно подписатся (подписка идет через useEventListener соответстыенно вызов такого события возможен через useEventDispatch)
 * @prop resetOnEvent сброс селекта до пустого значения, при появлении события указанного в updateOnEvent
 * @prop size - размер селекта
 * @prop defaultValue - выбранная папка по умолчанию
 */
function FolderSelect({ onChange, sortName = "", addClassNames = [], updateOnEvent, resetOnEvent, size = "medium", defaultValue }: TFolderSelectProps) {
    const prepareDefaultValue = defaultValue ? JSON.stringify(defaultValue) : undefined;
    const defaultClassName = "FolderSelect";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const selectLabelID = useId();
    const [selectValue, setSelectValue] = useState<string>(prepareDefaultValue ? prepareDefaultValue : "");
    const [isFoldersLoading, setIsFoldersLoading] = useState(false);

    const allFolders = useFolders({
        onStartLoading: () => {
            setIsFoldersLoading(true);
        },
        onEndLoading: () => {
            setIsFoldersLoading(false);
        },
    });

    const selectReset = () => {
        setSelectValue("");
    };

    const onCustomEvent = () => {
        if (resetOnEvent) {
            selectReset();
        }
    };

    useEventListener({ onEvent: onCustomEvent, eventName: updateOnEvent });

    // массив доступных папок
    const availableFolders = (function () {
        let temp = [] as IDataTreeFolder[];
        if (!allFolders) return temp;
        const selectedFolder = selectValue ? (JSON.parse(selectValue) as TSelectFOlderData) : { name: "" };
        for (let folder of allFolders) {
            if (folder.name === selectedFolder.name) {
                temp.push(folder);
                continue;
            }
            if (folder.name.includes(sortName)) temp.push(folder);
        }

        return temp;
    })();

    const onSelectChange = (event: SelectChangeEvent<typeof selectValue>) => {
        const value = event.target.value;
        setSelectValue(value);
        onChange && onChange(value);
    };

    return (
        <FormControl className={genClassName}>
            <InputLabel id={selectLabelID}>Папка</InputLabel>
            <Select
                size={size}
                labelId={selectLabelID}
                value={selectValue}
                label="Папка"
                onChange={onSelectChange}
                required
                input={<OutlinedInput label="Папка" />}
                renderValue={(selected) => {
                    const selectedParse = JSON.parse(selected) as TSelectFOlderData;
                    return <Typography>{selectedParse.name}</Typography>;
                }}
            >
                {isFoldersLoading && (
                    <MenuItem disabled key={"FolderSelect__loader"} value={"FolderSelect__defVal"}>
                        <CircularProgress />
                    </MenuItem>
                )}
                {availableFolders.map((folder) => {
                    return (
                        <MenuItem value={JSON.stringify({ id: folder.id, name: folder.name })} key={folder.id}>
                            {folder.name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}

export { FolderSelect };
