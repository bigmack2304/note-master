import React from "react";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import Typography from "@mui/material/Typography";
import { NoteTag } from "0-shared/components/NoteTag/NoteTag";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
//import { useTags } from "0-shared/hooks/useTags";
import "./NoteTagList.scss";

type TNoteTagListProps = {};

const noteTagListStyle = (theme: PaletteMode) => {
    return {
        backgroundColor: theme == "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    } as React.CSSProperties;
};

/**
 * содержимое для DialogWindow, (страница с настройками)
 */
function NoteTagList({}: TNoteTagListProps) {
    const themeValue = useTemeMode();
    const isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);
    const noteTags = useAppSelector((state) => state.saveDataInspect.currentNote?.tags);
    //const tags = useTags();

    return (
        <div className="NoteTagList" style={noteTagListStyle(themeValue)}>
            <Typography className="NoteTagList__tags_head" variant="body1">
                Теги:
            </Typography>
            {/* {noteTags &&
                noteTags.map((tagName) => {
                    return <NoteTag isEdit={isNoteEdit} tagObj={tags[tagName]} key={tags[tagName].tag_name} />;
                })} */}
        </div>
    );
}

export { NoteTagList };
export type { TNoteTagListProps };
