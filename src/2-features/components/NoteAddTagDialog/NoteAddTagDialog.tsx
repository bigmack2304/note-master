import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { AddTagSelect } from "../AddTagSelect/AddTagSelect";
import { Input } from "@mui/material";
import "./NoteAddTagDialog.scss";

type TNoteAddTagDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (selectValue: string[] | string) => void;
    dialogHeader?: string;
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
    const [selectValue, setSelectValue] = useState<string[]>([]);
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
        <DialogWindowAlt
            isOpen={true}
            onClose={onClose}
            onCloseSave={onSave}
            headerText={dialogHeader}
            actionButtonName="Сохранить"
            actionButton
            addClassNames={["NoteAddTagDialog"]}
        >
            <Input
                value={inputValue}
                placeholder="поиск тега"
                onChange={onInputChange}
                className="NoteAddTagDialog__input"
                autoComplete="off"
            />
            <AddTagSelect onChange={onSelectChange} sortName={inputValue} />
        </DialogWindowAlt>
    );
}

export { NoteAddTagDialog };
