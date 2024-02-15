import React from "react";
import { Box } from "@mui/material";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import "./Note.scss";
import { EditableHeader } from "2-features/components/EditableHeader/EditableHeader";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { AddButton } from "0-shared/components/AddButton/AddButton";
import { NoteTagList } from "2-features/components/NoteTagList/NoteTagList";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY, OUTLINE_DARK_COLOR, OUTLINE_LIGHT_COLOR } from "5-app/settings";
import { ChangeTime } from "1-entities/components/ChangeTime/ChangeTime";

type TNoteProps = {
    addClassNames?: string[];
};

const noteStyles = (theme: PaletteMode) => {
    return {
        display: "flex",
        flexDirection: "column",
        rowGap: "25px",
        minHeight: "100%",
    } as SxProps;
};

const noteEditBlockStyles = (theme: PaletteMode) => {
    return {
        backgroundColor: theme == "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
    } as SxProps;
};

const noteTagsStyle = (theme: PaletteMode) => {
    return {
        backgroundColor: theme == "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    } as React.CSSProperties;
};

/**
 * заметка
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @returns
 */
function Note({ addClassNames = [] }: TNoteProps) {
    const defaultClassName = "note";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();
    const isEdit = useAppSelector((store) => store.noteEditData.isEdit);
    const currentNote = useAppSelector((store) => store.saveDataInspect.currentNote);

    if (!currentNote) return <></>;

    return (
        <Box className={genClassName} component={"div"} sx={noteStyles(themeValue)}>
            <div className="note__content_wrapper">
                <ChangeTime createTime_timestamp={currentNote.createTime} lastEditTime_timestamp={currentNote.lastEditTime} />
                <NoteTagList />

                {currentNote.body.length > 0
                    ? currentNote.body.map((note) => {
                          if (note.component === "header") {
                              return <EditableHeader addClassNames={["note__head"]} defaultText={note.value} key={note.id} edit_id={note.id} />;
                          }
                      })
                    : null}
            </div>
            {isEdit && (
                <Box className={"note__editBlock"} sx={noteEditBlockStyles(themeValue)}>
                    <AddButton />
                </Box>
            )}
        </Box>
    );
}

export { Note };
