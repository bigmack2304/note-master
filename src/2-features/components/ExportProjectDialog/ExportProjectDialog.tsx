import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { Input } from "@mui/material";
import type { SxProps } from "@mui/material";
import { AddTagSelect } from "../AddTagSelect/AddTagSelect";
import { nameValidator } from "0-shared/utils/validators";

type TExportProjectDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (inputValue: string) => void;
    dialogHeader?: string;
    isOpen: boolean;
};

const inputStyle: SxProps = {
    paddingLeft: "4px",
    fontSize: "1.4rem",
};

/**
 * Диалоговое окно с формой для скачивания проекта
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 */
function ExportProjectDialog({ onClose, onCloseSave, dialogHeader = "Экспорт проекта", isOpen }: TExportProjectDialogProps) {
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
        <DialogWindowAlt isOpen={isOpen} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Скачать" actionButton>
            <Input value={inputValue} placeholder="Сохранить как" onChange={onInputChange} sx={inputStyle} required />
        </DialogWindowAlt>
    );
}

export { ExportProjectDialog };
