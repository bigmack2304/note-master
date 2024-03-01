import React, { useState } from "react";
import { Button, List, ListItem, TextField } from "@mui/material";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";
import * as styles from "./SelectNoteButtonStyles";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { NoteSelector } from "../NoteSelector/NoteSelector";

type TAllTagsEditProps = {
    addClassNames?: string[];
    onClose?: (selectNoteId: string) => void;
    selectedNote?: string;
};
/**
 * выводит окно со списком всех заметок, и возможностью выбрать одну
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop sortName - отображать теки которые включают в себя эту подстроку
 */
function SelectNoteButton({ addClassNames = [], onClose, selectedNote }: TAllTagsEditProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const defaultClassName = "AllTagsEdit";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();
    const [findNote, setFindNote] = useState("");
    const [selectedNoteId, setSelectedNoteId] = useState("");

    const onDialogClose = () => {
        setIsDialogOpen(false);
        setFindNote("");
        let prepare_selectedNoteId = selectedNoteId;

        if (prepare_selectedNoteId === "") {
            if (selectedNote) {
                prepare_selectedNoteId = selectedNote;
            } else {
                return;
            }
        }
        onClose && onClose(prepare_selectedNoteId);
    };

    const onButtonClick = () => {
        setIsDialogOpen(true);
    };

    const onFindNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFindNote(e.target.value);
    };

    const onNoteSelect = (value: string) => {
        setSelectedNoteId(value);
    };

    return (
        <>
            <Button className="ClosableImageForm__button_local" color="primary" aria-label="Выбрать заметку" size="small" variant="contained" onClick={onButtonClick}>
                Выбрать заметку
            </Button>
            <DialogWindow addClassNames={["NewTag_window"]} headerText="Выбор заметки" isOpen={isDialogOpen} onClose={onDialogClose}>
                <List className="NewTag_window__list" sx={styles.dialogListStyle(themeValue)}>
                    <ListItem>
                        <TextField
                            className="NewTag_window__find"
                            value={findNote}
                            label="Поиск заметки"
                            placeholder="Название заметки"
                            variant="filled"
                            onChange={onFindNoteChange}
                        />
                    </ListItem>
                    <ListItem>
                        <NoteSelector sortName={findNote} defaultValue={selectedNote} onSelect={onNoteSelect} />
                    </ListItem>
                </List>
            </DialogWindow>
        </>
    );
}

export { SelectNoteButton };
