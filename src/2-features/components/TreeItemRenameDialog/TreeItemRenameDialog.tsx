import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { Input } from "@mui/material";
import type { SxProps } from "@mui/material";
import { nameValidator } from "0-shared/utils/validators";

type TTreeItemRenameDialogProps = {
    inputDefValue?: string;
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (inputValue: string) => void;
    dialogHeader?: string;
};

const inputStyle: SxProps = {
    paddingLeft: "4px",
    fontSize: "1.4rem",
};

/**
 * Диалоговое окно для редактирования одной строки текста
 * @ используется при периименовании фаила в блоке фаиловой структуры
 *
 * @prop inputDefValue - дефолтный текст
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 */
function TreeItemRenameDialog({ inputDefValue, onClose, onCloseSave, dialogHeader = "Изменить имя" }: TTreeItemRenameDialogProps) {
    const [inputValue, setInputValue] = useState(inputDefValue || "");

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (nameValidator(e.target.value)) {
            setInputValue(e.target.value);
        }
    };

    const onSave = () => {
        onCloseSave && onCloseSave(inputValue);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <Input value={inputValue} placeholder="имя" onChange={onInputChange} sx={inputStyle} required />
        </DialogWindowAlt>
    );
}

export { TreeItemRenameDialog };
