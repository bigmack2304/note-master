import React, { useState, useId } from "react";
import { TreeEditDialig } from "1-entities/components/TreeEditDialig/TreeEditDialig";
import { Input } from "@mui/material";
import type { SxProps } from "@mui/material";
import { nameValidator } from "0-shared/utils/validators";

type TTreeAddFolderDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    //onCloseSave?: (inputValue: string, selectValue: string) => void;
    onCloseSave?: (inputValue: string) => void;
    dialogHeader?: string;
};

const inputStyle: SxProps = {
    paddingLeft: "4px",
    fontSize: "1.4rem",
    width: "clamp(20px, 400px, 30dvw)",
};

/**
 * Диалоговое окно с формой для добавления новой папки
 * @ используется при добавлении новой папки в фаиловую структуру
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 */
function TreeAddFolderDialog({ onClose, onCloseSave, dialogHeader }: TTreeAddFolderDialogProps) {
    const [inputValue, setInputValue] = useState("");
    //const [selectValue, setSelectValue] = useState("#00000000");
    //const selectLabelID = useId();

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (nameValidator(e.target.value)) {
            setInputValue(e.target.value);
        }
    };

    // const onSelectChange = (event: SelectChangeEvent) => {
    //     setSelectValue(event.target.value as string);
    // };

    const onSave = () => {
        //onCloseSave && onCloseSave(inputValue, selectValue);
        onCloseSave && onCloseSave(inputValue);
    };

    return (
        <TreeEditDialig isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader}>
            <Input value={inputValue} placeholder="имя папки" onChange={onInputChange} sx={inputStyle} required />
            {/* <FormControl>
                <InputLabel id={selectLabelID}>Цвет</InputLabel>
                <Select defaultValue={"#00000000"} labelId={selectLabelID} value={selectValue} label="Цвет" onChange={onSelectChange}>
                    <MenuItem value={"lol kek"}>ПОКА НЕ РИАЛИЗОВАНО</MenuItem>
                    <MenuItem value={"#00000000"}>отсутствует</MenuItem>
                </Select>
            </FormControl> */}
        </TreeEditDialig>
    );
}

export { TreeAddFolderDialog };
