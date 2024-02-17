import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { AddTagSelect } from "../AddTagSelect/AddTagSelect";
import { Input } from "@mui/material";
import type { SxProps } from "@mui/material";

type TNoteAddTagDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (selectValue: string[] | string) => void;
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
function NoteAddTagDialog({ onClose, onCloseSave, dialogHeader }: TNoteAddTagDialogProps) {
    const [selectValue, setSelectValue] = useState<string[] | string>([]);
    const [inputValue, setInputValue] = useState("");

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const onSelectChange = (tagNames: string | string[]) => {
        setSelectValue(typeof tagNames === "string" ? tagNames.split(",") : tagNames);
    };

    const onSave = () => {
        onCloseSave && onCloseSave(selectValue);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <Input value={inputValue} placeholder="поиск тега" onChange={onInputChange} sx={inputStyle} />
            <AddTagSelect onChange={onSelectChange} sortName={inputValue} />
        </DialogWindowAlt>
    );
}

export { NoteAddTagDialog };
