import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { Input } from "@mui/material";
import type { SxProps } from "@mui/material";
import { AddTagSelect } from "../AddTagSelect/AddTagSelect";
import { nameValidator } from "0-shared/utils/validators";

type TTreeAddNoteDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (inputValue: string, selectValue: string[] | string) => void;
    dialogHeader?: string;
};

const inputStyle: SxProps = {
    paddingLeft: "4px",
    fontSize: "1.4rem",
};

/**
 * Диалоговое окно с формой для добавления новой заметки
 * @ используется при добавлении новой заметки в фаиловую структуру
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 */
function TreeAddNoteDialog({ onClose, onCloseSave, dialogHeader = "Новая заметка" }: TTreeAddNoteDialogProps) {
    const [inputValue, setInputValue] = useState("");
    const [selectValue, setSelectValue] = useState<string[] | string>([]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (nameValidator(e.target.value)) {
            setInputValue(e.target.value);
        }
    };

    const onSelectChange = (tagNames: string | string[]) => {
        setSelectValue(typeof tagNames === "string" ? tagNames.split(",") : tagNames);
    };

    const onSave = () => {
        onCloseSave && onCloseSave(inputValue, selectValue);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <Input value={inputValue} placeholder="имя заметки" onChange={onInputChange} sx={inputStyle} required />
            <AddTagSelect onChange={onSelectChange} />
        </DialogWindowAlt>
    );
}

export { TreeAddNoteDialog };
