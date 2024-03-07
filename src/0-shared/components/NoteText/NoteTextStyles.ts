import type { PaletteMode } from "@mui/material";
import type { SxProps } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";

function typographyStyle(themeMode: PaletteMode): SxProps {
    return {
        "&.NoteText.text_empty": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },
    };
}

function wrapperStyle(themeMode: PaletteMode): SxProps {
    return {
        "&.NoteText_wrapper.dragZoneOk": {
            outline: `2px ${themeMode === "light" ? "black" : "white"}  dashed`,
        },
        "&.NoteText_wrapper.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    };
}

export { typographyStyle, wrapperStyle };
