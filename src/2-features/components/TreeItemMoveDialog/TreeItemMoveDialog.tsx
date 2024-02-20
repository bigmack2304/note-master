import React, { useState, useId } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { Input } from "@mui/material";
import type { SxProps } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material";
import { getAllFolders } from "2-features/utils/saveDataParse";
import { useDataTree } from "0-shared/hooks/useDataTree";

type TTreeItemMoveDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (inputValue: string, selectFolderJSON: string) => void;
    muvedFileName?: string;
};

const inputStyle: SxProps = {
    paddingLeft: "4px",
    fontSize: "1.4rem",
};

/**
 * Диалоговое окно для перемещения папки или заметки в другую папку
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
    const dataTree = useDataTree();
    const allFolders = dataTree ? getAllFolders(dataTree) : [];

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

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={TreeEditDialigHeader} actionButtonName="Сохранить" actionButton>
            <Input value={inputValue} placeholder="Поиск папки" onChange={onInputChange} sx={inputStyle} />
            <FormControl>
                <InputLabel id={selectLabelID}>Переместить в</InputLabel>
                <Select labelId={selectLabelID} value={selectValue} label="Переместить в" onChange={onSelectChange} required>
                    {allFolders.map((folder) => {
                        if (folder.name.includes(inputValue)) {
                            return (
                                <MenuItem divider value={JSON.stringify(folder)} key={folder.id}>
                                    {folder.name}
                                </MenuItem>
                            );
                        }
                    })}
                </Select>
            </FormControl>
        </DialogWindowAlt>
    );
}

export { TreeItemMoveDialog };
