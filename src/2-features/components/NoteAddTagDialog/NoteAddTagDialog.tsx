import React, { useState } from "react";
import { TreeEditDialig } from "1-entities/components/TreeEditDialig/TreeEditDialig";
import { AddTagSelect } from "../AddTagSelect/AddTagSelect";

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
    const [selectValue, setSelectValue] = useState<string[] | string>([]);

    const onSelectChange = (tagNames: string | string[]) => {
        setSelectValue(typeof tagNames === "string" ? tagNames.split(",") : tagNames);
    };

    const onSave = () => {
        onCloseSave && onCloseSave(selectValue);
    };

    return (
        <TreeEditDialig isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader}>
            <AddTagSelect onChange={onSelectChange} />
        </TreeEditDialig>
    );
}

export { NoteAddTagDialog };
