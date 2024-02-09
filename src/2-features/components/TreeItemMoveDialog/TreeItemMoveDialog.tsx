import React, { useState, useId, useEffect } from "react";
import { TreeEditDialig } from "1-entities/components/TreeEditDialig/TreeEditDialig";
import { Input } from "@mui/material";
import type { SxProps } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material";
import { getTempDataDB } from "2-features/utils/appIndexedDB";
import { getAllFolders } from "2-features/utils/saveDataParse";
import type { IDataTreeFolder } from "0-shared/types/dataSave";

type TTreeItemMoveDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (inputValue: string, selectFolderJSON: string) => void;
    muvedFileName?: string;
};

const inputStyle: SxProps = {
    paddingLeft: "4px",
    fontSize: "1.4rem",
    width: "clamp(20px, 400px, 30dvw)",
};

/**
 * Диалоговое окно для перемещения папки или заметки в другую папку
 * @ используется при периименовании фаила в блоке фаиловой структуры
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении субмите диалога
 * @prop muvedFileName - имя перемещаемого фаила
 */
function TreeItemMoveDialog({ onClose, onCloseSave, muvedFileName }: TTreeItemMoveDialogProps) {
    const TreeEditDialigHeader = !muvedFileName ? "" : `Перемещение [${muvedFileName}]`;
    const selectLabelID = useId();
    const [inputValue, setInputValue] = useState("");
    const [selectValue, setSelectValue] = useState<string>("");
    const [allFolders, setAllFolders] = useState<IDataTreeFolder[]>([]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setSelectValue("");
    };

    const onSelectChange = (event: SelectChangeEvent) => {
        setSelectValue(event.target.value as string);
    };

    const onSave = () => {
        onCloseSave && onCloseSave(inputValue, selectValue);
    };

    useEffect(() => {
        getTempDataDB({
            callback: (dataSave) => {
                if (!dataSave) return;
                setAllFolders(getAllFolders(dataSave));
            },
        });
    }, []);

    return (
        <TreeEditDialig isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={TreeEditDialigHeader}>
            <Input value={inputValue} placeholder="Поиск папки" onChange={onInputChange} sx={inputStyle} />
            <FormControl>
                <InputLabel id={selectLabelID}>Переместить в</InputLabel>
                <Select labelId={selectLabelID} value={selectValue} label="Переместить в" onChange={onSelectChange} required>
                    {allFolders.map((folder) => {
                        if (folder.name.includes(inputValue)) {
                            return (
                                <MenuItem value={JSON.stringify(folder)} key={folder.id}>
                                    {folder.name}
                                </MenuItem>
                            );
                        }
                    })}
                </Select>
            </FormControl>
        </TreeEditDialig>
    );
}

export { TreeItemMoveDialog };
