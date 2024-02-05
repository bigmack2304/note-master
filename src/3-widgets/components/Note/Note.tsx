import React from "react";
import { Box } from "@mui/material";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import "./Note.scss";
import { EditableHeader } from "2-features/components/EditableHeader/EditableHeader";
import { useAppSelector } from "0-shared/hooks/useAppSelector";

type TNoteProps = {
    addClassNames?: string[];
};

const noteStyles = (theme: PaletteMode) => {
    return {
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
    } as SxProps;
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
    const currentNote = useAppSelector((store) => store.saveDataInspect.currentNote);

    return (
        <Box className={genClassName} component={"div"} sx={noteStyles(themeValue)}>
            {currentNote && currentNote.body.length > 0
                ? currentNote.body.map((note) => {
                      if (note.component === "header") {
                          return <EditableHeader defaultText={note.value} key={note.id} edit_id={note.id} />;
                      }
                  })
                : null}
        </Box>
    );
}

export { Note };
