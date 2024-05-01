import React, { useState, useId } from "react";
import { List, ListItem, FormControlLabel, RadioGroup, FormLabel, FormControl, Radio, Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { useNotes } from "0-shared/hooks/useNotes";
import * as styles from "./NoteSelectorStyles";
import { NoteTagList } from "../NoteTagList/NoteTagList";
import type { IDataTreeNote } from "0-shared/types/dataSave";

type TNoteSelectorProps = {
    addClassNames?: string[];
    sortName?: string;
    onSelect?: (value: string) => void;
    defaultValue?: string;
    sortTags?: string[];
};

type TRadioData = {
    id: string;
    name: string;
};

/**
 * выводит список всех заметок с radio елементом для выбора какойто одной заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop sortName - отображать теки которые включают в себя эту подстроку
 * @prop onSelect - вызывается при выборе какойто заметки
 * @prop defaultValue - выбраннная заметка по дефолту (id)
 */
function NoteSelector({ addClassNames = [], sortName = "", onSelect, defaultValue = "", sortTags = [] }: TNoteSelectorProps) {
    const defaultClassName = "NoteSelector";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();
    const [isTagsLoading, setIsTagsLoading] = useState(false);
    const formControlId = useId();
    const [noteSelect, setNoteSelect] = useState(defaultValue);

    const allTags = useNotes({
        onStartLoading: () => {
            setIsTagsLoading(true);
        },
        onEndLoading: () => {
            setIsTagsLoading(false);
        },
    });

    let prepareAllNotes: IDataTreeNote[] = [];

    if (allTags) {
        prepareAllNotes = Object.values(allTags);
        // сортировка по имяни
        prepareAllNotes = prepareAllNotes.filter((note) => {
            if (note.id === noteSelect) return true;
            if (note.name.includes(sortName)) return true;
            return false;
        });

        // сортировка по тегам
        prepareAllNotes = prepareAllNotes.filter((note) => {
            if (sortTags.length === 0) return true;
            if (note.id === noteSelect) return true;
            for (let sortTag of sortTags) {
                if (note.tags && !note.tags.includes(sortTag)) return false;
            }
            return true;
        });
    }

    const radioChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoteSelect(e.target.value);
        onSelect && onSelect(e.target.value);
    };

    return (
        <List className={genClassName} sx={styles.dialogInnerListStyle(themeValue)}>
            {isTagsLoading ? (
                <CircularProgress />
            ) : (
                <FormControl>
                    <FormLabel id={formControlId}>Выбор Заметки</FormLabel>
                    <Divider />
                    <RadioGroup aria-labelledby={formControlId} name="список заметок" onChange={radioChangeEvent} value={noteSelect}>
                        {prepareAllNotes.map((note) => {
                            return (
                                <ListItem key={note.id} divider className="NoteSelector__Item">
                                    <FormControlLabel
                                        value={JSON.stringify({ id: note.id, name: note.name })}
                                        control={<Radio />}
                                        label={note.name}
                                        sx={styles.radioFormControlStyle(themeValue)}
                                    />
                                    <NoteTagList noteTags={note.tags ?? []} isNoteEdit={false} />
                                </ListItem>
                            );
                        })}
                    </RadioGroup>
                </FormControl>
            )}
        </List>
    );
}

export { NoteSelector };
export type { TRadioData };
