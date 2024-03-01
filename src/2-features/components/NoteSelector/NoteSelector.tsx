import React, { useState, useId } from "react";
import { List, ListItem, FormControlLabel, RadioGroup, FormLabel, FormControl, Radio } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { useNotes } from "0-shared/hooks/useNotes";
import * as styles from "./NoteSelectorStyles";
import type { IDataTreeNote } from "0-shared/types/dataSave";

type TNoteSelectorProps = {
    addClassNames?: string[];
    sortName?: string;
    onSelect?: (value: string) => void;
    defaultValue?: string;
};

type TRadioData = {
    id: string;
    name: string;
};

/**
 * список всех тегов с возможностью их редактирования
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop sortName - отображать теки которые включают в себя эту подстроку
 */
function NoteSelector({ addClassNames = [], sortName = "", onSelect, defaultValue = "" }: TNoteSelectorProps) {
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
        prepareAllNotes = prepareAllNotes.filter((note) => {
            if (note.name.includes(sortName)) return true;
            return false;
        });
    }

    const radioChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoteSelect(e.target.value);
        onSelect && onSelect(e.target.value);
    };

    return (
        <List className={genClassName} sx={styles.dialogInnerListStyle(themeValue)}>
            {isTagsLoading ? (
                <CircularProgress sx={styles.loaderStyle()} />
            ) : (
                <FormControl>
                    <FormLabel id={formControlId}>Выбор Заметки</FormLabel>
                    <RadioGroup aria-labelledby={formControlId} name="список заметок" onChange={radioChangeEvent} value={noteSelect}>
                        {prepareAllNotes.map((note) => {
                            return (
                                <ListItem key={note.id} divider className="NoteSelector__Item">
                                    <FormControlLabel value={JSON.stringify({ id: note.id, name: note.name })} control={<Radio />} label={note.name} />
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
