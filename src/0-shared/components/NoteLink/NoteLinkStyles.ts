import type { PaletteMode, SxProps } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import { fontThemeColor } from "2-features/utils/themeStylesOverride";

function wrapperStyle(themeMode: PaletteMode): SxProps {
    return {
        "&.NoteLink_wrapper.dragZoneOk": {
            outline: `2px ${themeMode === "light" ? "black" : "white"}  dashed`,
        },
        "&.NoteLink_wrapper.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    };
}

function linkStyle(themeMode: PaletteMode): SxProps {
    return {
        "&.NoteLink.text_empty": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },

        "&.NoteLink.text_empty:before": {
            color: fontThemeColor(themeMode),
        },

        "&.NoteLink--bg": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },
    };
}

export { linkStyle, wrapperStyle };
