import React, { useState } from "react";
import { AddButton } from "0-shared/components/AddButton/AddButton";
import { NoteAddComponentDialog } from "../NoteAddComponentDialog/NoteAddComponentDialog";
import { addNewComponentInNote } from "5-app/GlobalState/saveDataInspectStore";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import type { TAllComponents } from "0-shared/types/dataSave";

type TButtonAddComponentToNoteDialogProps = {};

/**
 * Кнопка добавления нового компонента в заметку
 */
function ButtonAddComponentToNoteDialog({}: TButtonAddComponentToNoteDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const currentNote = useAppSelector((store) => store.saveDataInspect.currentNote);
    const dispatch = useAppDispatch();

    const onButtonClick = () => {
        setIsDialogOpen(true);
    };

    const onDialogClose = () => {
        setIsDialogOpen(false);
    };

    const onDialogCloseSave = (selectVal: TAllComponents) => {
        setIsDialogOpen(false);

        if (!currentNote) return;

        dispatch(addNewComponentInNote({ noteId: currentNote.id, componentType: selectVal }));
    };

    return (
        <>
            <AddButton onClick={onButtonClick} />
            {isDialogOpen && <NoteAddComponentDialog onClose={onDialogClose} onCloseSave={onDialogCloseSave} />}
        </>
    );
}

export { ButtonAddComponentToNoteDialog };
