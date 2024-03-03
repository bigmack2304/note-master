import React, { useState } from "react";
import { Button, List, ListItem, TextField, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";
import * as styles from "./SelectNoteButtonStyles";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { NoteSelector } from "../NoteSelector/NoteSelector";
import { AddTagSelect } from "../AddTagSelect/AddTagSelect";
import { ResetButton } from "0-shared/components/ResetButton/ResetButton";
import { useEventDispatch } from "0-shared/hooks/useEventDispatch";
import "./styles.scss";

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
    const [findTag, setFindTag] = useState("");
    const [selectedNoteId, setSelectedNoteId] = useState("");
    const [sortTags, setSortTags] = useState<string[]>([]);
    const [eventDispatch] = useEventDispatch({ eventName: "SelectNoteButton_selectReset" });

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

    const onFindTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFindTag(e.target.value);
    };

    const onNoteSelect = (value: string) => {
        setSelectedNoteId(value);
    };

    const onTagSelectChange = (tagNames: string | string[]) => {
        let prepareTagNames = Array.isArray(tagNames) ? tagNames : [tagNames];

        setSortTags(prepareTagNames);
    };

    const onResetButton = () => {
        setFindNote("");
        setFindTag("");
        setSortTags([]);
        eventDispatch();
    };

    return (
        <>
            <Button className={genClassName} color="primary" aria-label="Выбрать заметку" size="small" variant="contained" onClick={onButtonClick}>
                Выбрать заметку
            </Button>
            <DialogWindow addClassNames={["SelectNoteButton__dialog_window"]} headerText="Выбор заметки" isOpen={isDialogOpen} onClose={onDialogClose}>
                <List className="SelectNoteButton__dialog_list" sx={styles.dialogListStyle(themeValue)}>
                    <ListItem>
                        <Accordion sx={{ width: "100%" }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Фильтры
                                <ResetButton onClick={onResetButton} title="Сбросить фильтры" isStopPropagation={true} />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box className="SelectNoteButton__filter_item">
                                    <TextField
                                        className="SelectNoteButton__tag_find_input"
                                        value={findTag}
                                        label="Поиск тега"
                                        placeholder="Название тега"
                                        variant="filled"
                                        onChange={onFindTagChange}
                                        size="small"
                                    />
                                </Box>
                                <Box className="SelectNoteButton__filter_item">
                                    <AddTagSelect
                                        size="small"
                                        viewAll
                                        addClassNames={["SelectNoteButton__tagSelect"]}
                                        onChange={onTagSelectChange}
                                        sortName={findTag}
                                        resetOnEvent
                                        updateOnEvent={"SelectNoteButton_selectReset"}
                                    />
                                </Box>
                                <Box className="SelectNoteButton__filter_item">
                                    <TextField
                                        className="SelectNoteButton__note_find_input"
                                        value={findNote}
                                        label="Поиск заметки"
                                        placeholder="Название заметки"
                                        variant="filled"
                                        onChange={onFindNoteChange}
                                        size="small"
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </ListItem>
                    <ListItem className="SelectNoteButton__notes">
                        <NoteSelector
                            sortName={findNote}
                            sortTags={sortTags}
                            defaultValue={selectedNote}
                            onSelect={onNoteSelect}
                            addClassNames={["SelectNoteButton__noteSelector"]}
                        />
                    </ListItem>
                </List>
            </DialogWindow>
        </>
    );
}

export { SelectNoteButton };
