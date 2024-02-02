import React from "react";
import { Box } from "@mui/material";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import "./Note.scss";
import { EditableHeader } from "2-features/components/EditableHeader/EditableHeader";

type TNoteProps = {
    headerText?: string;
    addClassNames?: string[];
};

const noteStyles = (theme: PaletteMode) => {
    return {
        display: "flex",
        flexDirection: "column",
    } as SxProps;
};

function Note({ headerText, addClassNames = [] }: TNoteProps) {
    const defaultClassName = "note";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();
    return (
        <Box className={genClassName} component={"div"} sx={noteStyles(themeValue)}>
            <EditableHeader defaultText={headerText} />
        </Box>
    );
}

export { Note };
