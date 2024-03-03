import React, { useState, useId } from "react";
import { OutlinedInput, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { useTags } from "0-shared/hooks/useTags";
import { NoteTag } from "0-shared/components/NoteTag/NoteTag";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { IGlobalTag } from "0-shared/types/dataSave";
import type { PaletteMode, SxProps, SelectChangeEvent } from "@mui/material";
import { useEventListener } from "0-shared/hooks/useEventListener";
import type { GetProps } from "0-shared/utils/typeHelpers";

type TAddTagSelectProps = {
    onChange?: (tagNames: string | string[]) => void;
    sortName?: string;
    viewAll?: boolean;
    addClassNames?: string[];
    updateOnEvent?: string | string[];
    resetOnEvent?: boolean;
    size?: GetProps<typeof Select>["size"];
};

const addTagSelectStyle = (tag: IGlobalTag, isColored: boolean, theme: PaletteMode) => {
    let style = {} as React.CSSProperties;

    if (isColored) {
        let colorMix = theme === "light" ? "#FFFFFF0F" : "#000000";
        let colorOpacyty = theme === "light" ? "60%" : "85%";
        style.backgroundColor = `color-mix(in srgb-linear, ${tag.color}, ${colorMix} ${colorOpacyty})`;
    }

    return style as SxProps;
};

/**
 * выводит список всех тегов, поддерживается сортировка и исключение тех тегов которые есть в активной заметке
 * @ можно юзать для добавления тегов в заметку
 * @prop onChange функция вызывается при изменении селекта
 * @prop sortName - отображать теки которые включают в себя эту подстроку
 * @prop viewAll если false то в списке будут только те теги которых нету в активной заметке, с учетом sortName, если true то в списке будут все теги с учетом sortName
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop updateOnEvent любое имя события на которое нужно подписатся (подписка идет через useEventListener соответстыенно вызов такого события возможен через useEventDispatch)
 * @prop resetOnEvent сброс селекта до пустого значения, при появлении события указанного в updateOnEvent
 */
function AddTagSelect({ onChange, sortName = "", viewAll = false, addClassNames = [], updateOnEvent, resetOnEvent, size = "medium" }: TAddTagSelectProps) {
    const defaultClassName = "AddTagSelect";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const selectLabelID = useId();
    const [selectValue, setSelectValue] = useState<string[]>([]);
    const currentNote = useAppSelector((state) => state.saveDataInspect.currentNote);
    const tagColored = useAppSelector((state) => state.settingsData.highlightingTagsInForms);
    const [isTagsLoading, setIsTagsLoading] = useState(false);
    const themeValue = useTemeMode();

    const allTags = useTags({
        onStartLoading: () => {
            setIsTagsLoading(true);
        },
        onEndLoading: () => {
            setIsTagsLoading(false);
        },
    });

    const selectReset = () => {
        setSelectValue([]);
    };

    const onCustomEvent = () => {
        if (resetOnEvent) {
            selectReset();
        }
    };

    useEventListener({ onEvent: onCustomEvent, eventName: updateOnEvent });

    // массив доступных тегов. (если в активной заметке есть какието теги то они считаются недоступными)
    const availableTags = (function () {
        let temp = [] as IGlobalTag[];
        if (!allTags) return temp;

        if (viewAll) {
            for (let tag in allTags) {
                if (tag.includes(sortName)) temp.push(allTags[tag]);
            }
            return temp;
        }

        if (!currentNote || !currentNote.tags) return Object.values(allTags);
        for (let tag in allTags) {
            if (currentNote.tags.includes(tag)) continue;
            if (tag.includes(sortName)) temp.push(allTags[tag]);
        }
        return temp;
    })();

    const onSelectChange = (event: SelectChangeEvent<typeof selectValue>) => {
        const value = event.target.value;
        setSelectValue(typeof value === "string" ? value.split(",") : value);
        onChange && onChange(value);
    };

    return (
        <FormControl className={genClassName}>
            <InputLabel id={selectLabelID}>Теги</InputLabel>
            <Select
                size={size}
                labelId={selectLabelID}
                value={selectValue}
                label="Теги"
                onChange={onSelectChange}
                multiple
                input={<OutlinedInput label="Теги." />}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((tagName) => {
                            return <NoteTag isEdit={false} tagObj={allTags![tagName]} key={tagName} />;
                        })}
                    </Box>
                )}
            >
                {isTagsLoading && (
                    <MenuItem disabled key={"AddTagSelect__loader"} value={"AddTagSelect__defVal"}>
                        <CircularProgress />
                    </MenuItem>
                )}
                {availableTags.map((tag) => {
                    return (
                        <MenuItem value={tag.tag_name} key={tag.tag_name} sx={addTagSelectStyle(tag, tagColored, themeValue)}>
                            {tag.tag_name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}

export { AddTagSelect };
