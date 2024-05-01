import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { Input } from "@mui/material";
import { nameValidator } from "0-shared/utils/validators";
import "./TreeAddFolderDialog.scss";

type TTreeAddFolderDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (inputValue: string) => void;
    dialogHeader?: string;
};

/**
 * Диалоговое окно с формой для добавления новой папки
 * @ используется при добавлении новой папки в фаиловую структуру
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 */
function TreeAddFolderDialog({ onClose, onCloseSave, dialogHeader = "Новая папка" }: TTreeAddFolderDialogProps) {
    const [inputValue, setInputValue] = useState("");

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (nameValidator(e.target.value)) {
            setInputValue(e.target.value);
        }
    };

    const onSave = () => {
        onCloseSave && onCloseSave(inputValue);
    };

    return (
        <DialogWindowAlt
            isOpen={true}
            onClose={onClose}
            onCloseSave={onSave}
            headerText={dialogHeader}
            actionButtonName="Сохранить"
            actionButton
            addClassNames={["TreeAddFolderDialog"]}
        >
            <Input value={inputValue} placeholder="имя папки" onChange={onInputChange} className="TreeAddFolderDialog__input" required />
        </DialogWindowAlt>
    );
}

export { TreeAddFolderDialog };
