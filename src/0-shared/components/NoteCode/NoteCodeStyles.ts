import { codeCustomThemeLight, codeCustomThemeDark } from "./NoteCodeValues";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import type { TCodeThemes } from "./NoteCodeTypes";
import type { PaletteMode, SxProps } from "@mui/material";
import type { CSSProperties } from "react";

// определяет стили тему для кода
function calcCodeTheme(codeTheme: TCodeThemes, themeMode: PaletteMode) {
    if (codeTheme === "auto") {
        if (themeMode === "dark") return codeCustomThemeDark;
        if (themeMode === "light") return codeCustomThemeLight;
    }
    if (codeTheme === "dark") return codeCustomThemeDark;
    if (codeTheme === "light") return codeCustomThemeLight;
    return codeCustomThemeLight;
}

// стили для кода
function codeStyle(isChildren: boolean): CSSProperties {
    return {
        width: "100%",
        overflowX: "auto",
        fontFamily: "monospace",
        fontSize: "1rem",

        ...(!isChildren ? { minHeight: "3rem" } : {}),
    };
}

function codeWrapperStyle(themeMode: PaletteMode): SxProps {
    return {
        "&.NoteCode.text_empty": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },

        "&.NoteCode.dragZoneOk": {
            outline: `2px ${themeMode === "light" ? "black" : "white"}  dashed`,
            // boxShadow: "0px -6px 0px 0px white",
        },
        "&.NoteCode.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    };
}

export { calcCodeTheme, codeStyle, codeWrapperStyle };
