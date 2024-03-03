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
 * кнопка, при нажатии выводит окно со списком всех заметок и возможностью выбора одной
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClose - вызывается после закрытия окна с выбором заметок
 * @prop selectedNote - (id) заметки которая будет выбрана по умолчанию в списке заметок
 */
function SelectNoteButton({ addClassNames = [], onClose, selectedNote }: TAllTagsEditProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const defaultClassName = "SelectNoteButton";
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
            <Button className={genClassName} color="primary" aria-label="Выбрать заметку" size="small" variant="contained" onClick={onButtonClick}>
                Выбрать заметку
            </Button>
            <DialogWindow addClassNames={["SelectNoteButton__dialog_window"]} headerText="Выбор заметки" isOpen={isDialogOpen} onClose={onDialogClose}>
                <List className="SelectNoteButton__dialog_list" sx={styles.dialogListStyle(themeValue)}>
                    <ListItem>
                        <TextField
                            className="SelectNoteButton__note_find_input"
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
