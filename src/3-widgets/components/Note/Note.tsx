import React, { useRef } from "react";
import { Box, Collapse } from "@mui/material";
import type { SxProps, PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import "./Note.scss";
import { EditableHeader } from "2-features/components/EditableHeader/EditableHeader";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { NoteTagList } from "2-features/components/NoteTagList/NoteTagList";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY, OUTLINE_DARK_COLOR, OUTLINE_LIGHT_COLOR } from "5-app/settings";
import { ChangeTime } from "1-entities/components/ChangeTime/ChangeTime";
import { NoteStatus } from "1-entities/components/NoteStatus/NoteStatus";
import { ButtonAddComponentToNoteDialog } from "2-features/components/ButtonAddComponentToNoteDialog/ButtonAddComponentToNoteDialog";
import { EditableText } from "2-features/components/EditableText/EditableText";
import { EditableCode } from "2-features/components/EditableCode/EditableCode";

type TNoteProps = {
    addClassNames?: string[];
};

const noteStyles = (theme: PaletteMode, isEdit: boolean) => {
    return {
        ...(isEdit
            ? {}
            : {
                  "& .note__content_wrapper": {
                      backgroundColor: theme === "light" ? "#fffefa" : THEME_DARK_GRAY,
                  },
              }),
    } as SxProps;
};

const noteEditBlockStyles = (theme: PaletteMode) => {
    return {
        backgroundColor: theme == "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
    } as SxProps;
};

/**
 * заметка
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @returns
 */
function Note({ addClassNames = [] }: TNoteProps) {
    const isEdit = useAppSelector((store) => store.noteEditData.isEdit);
    const defaultClassName = "note";
    isEdit && addClassNames.push("note-edit");
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();
    const currentNote = useAppSelector((store) => store.saveDataInspect.currentNote);

    if (!currentNote) return <></>;

    return (
        <Box className={genClassName} component={"div"} sx={noteStyles(themeValue, isEdit)}>
            <div className="note__content_wrapper">
                <ChangeTime createTime_timestamp={currentNote.createTime} lastEditTime_timestamp={currentNote.lastEditTime} />
                <NoteStatus />
                <NoteTagList />

                {currentNote.body.length > 0
                    ? currentNote.body.map((noteComponent) => {
                          if (noteComponent.component === "header") {
                              return (
                                  <EditableHeader
                                      addClassNames={["note__head", "note__content"]}
                                      defaultText={noteComponent.value}
                                      key={noteComponent.id}
                                      edit_id={noteComponent.id}
                                      componentData={noteComponent}
                                  />
                              );
                          }
                          if (noteComponent.component === "text") {
                              return (
                                  <EditableText
                                      addClassNames={["note__text", "note__content"]}
                                      defaultText={noteComponent.value}
                                      key={noteComponent.id}
                                      edit_id={noteComponent.id}
                                      componentData={noteComponent}
                                  />
                              );
                          }
                          if (noteComponent.component === "code") {
                              return (
                                  <EditableCode
                                      addClassNames={["note__code", "note__content"]}
                                      defaultText={noteComponent.value}
                                      key={noteComponent.id}
                                      edit_id={noteComponent.id}
                                      componentData={noteComponent}
                                  />
                              );
                          }
                      })
                    : null}
            </div>
            <Collapse in={isEdit} unmountOnExit sx={{ alignSelf: "end" }}>
                <Box className={"note__editBlock"} sx={noteEditBlockStyles(themeValue)}>
                    <ButtonAddComponentToNoteDialog />
                </Box>
            </Collapse>
        </Box>
    );
}

export { Note };
