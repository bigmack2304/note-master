import type { PaletteMode } from "@mui/material";
import type { SxProps } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";

function ListStyle(themeMode: PaletteMode): SxProps {
    return {
        "&.NoteList.text_empty": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },
        "&.NoteList.NoteList--bg-light": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },
        "&.NoteList.NoteList--bg-dark": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },
    };
}

function outWrapperStyle(themeMode: PaletteMode): SxProps {
    return {
        "&.NoteList_outWrapper.dragZoneOk": {
            outline: `2px ${themeMode === "light" ? "black" : "white"}  dashed`,
        },
        "&.NoteList_outWrapper.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    };
}

export { ListStyle, outWrapperStyle };
