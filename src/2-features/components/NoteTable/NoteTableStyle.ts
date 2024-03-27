import type { SxProps, PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import { fontThemeColor } from "2-features/utils/themeStylesOverride";

function noteTableStyle(theme: PaletteMode): SxProps {
    return {
        "&.NoteTable.text_empty": {
            backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },

        "&.NoteTable.text_empty:before": {
            color: fontThemeColor(theme),
        },
    };
}

function outWrapperStyle(theme: PaletteMode): SxProps {
    return {
        "&.NoteTable__out_wrapper.dragZoneOk": {
            outline: `2px ${theme === "light" ? "black" : "white"}  dashed`,
        },
        "&.NoteTable__out_wrapper.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    };
}

export { noteTableStyle, outWrapperStyle };
