import React from "react";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import Typography from "@mui/material/Typography";
import { NoteTag } from "0-shared/components/NoteTag/NoteTag";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY, OUTLINE_DARK_COLOR, OUTLINE_LIGHT_COLOR } from "5-app/settings";
import { useTags } from "0-shared/hooks/useTags";
import "./NoteTagList.scss";
import { AddButton } from "0-shared/components/AddButton/AddButton";
import type { IGlobalTag } from "0-shared/types/dataSave";

type TNoteTagListProps = {};

const noteTagListStyle = (theme: PaletteMode) => {
    return {
        backgroundColor: theme == "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        outline: theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR,
    } as React.CSSProperties;
};

/**
 * содержимое для DialogWindow, (страница с настройками)
 */
function NoteTagList({}: TNoteTagListProps) {
    const themeValue = useTemeMode();
    const isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);
    const noteTags = useAppSelector((state) => state.saveDataInspect.currentNote?.tags);
    const tags = useTags();
    const isTags = Boolean(noteTags && tags);

    const onDelTag = (tagData: IGlobalTag) => {
        console.dir(tagData);
    };

    return (
        <div className="NoteTagList" style={noteTagListStyle(themeValue)}>
            <Typography className="NoteTagList__tags_head" variant="body1">
                Теги:
            </Typography>
            <div className="NoteTagList__tags">
                {isTags &&
                    noteTags!.map((tagName) => {
                        return <NoteTag isEdit={isNoteEdit} tagObj={tags![tagName]} key={tags![tagName].tag_name} onDel={onDelTag} />;
                    })}
            </div>
            {isNoteEdit && <AddButton />}
        </div>
    );
}

export { NoteTagList };
export type { TNoteTagListProps };
