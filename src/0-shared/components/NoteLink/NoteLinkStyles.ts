import type { PaletteMode, SxProps } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";

function linkStyle(isChildren: boolean, themeMode: PaletteMode): SxProps {
    return {
        display: "inline-block",

        ...(!isChildren && {
            minHeight: "3rem",
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
            borderRadius: "3px",
        }),

        "&.NoteLink--editable:hover": {
            outline: "1px red solid",
        },

        "&.NoteLink--bg": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
            padding: "5px",
            borderRadius: "5px",
        },
    };
}

export { linkStyle };
