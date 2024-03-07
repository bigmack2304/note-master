import type { SxProps, PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import { fontThemeColor } from "2-features/utils/themeStylesOverride";

const noteImageStyle = (theme: PaletteMode) => {
    return {
        "&.NoteImage.img_empty": {
            backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },

        "&.NoteImage.img_empty:before": {
            color: fontThemeColor(theme),
        },

        "&.NoteImage.dragZoneOk": {
            outline: `2px ${theme === "light" ? "black" : "white"}  dashed`,
        },
        "&.NoteImage.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    } as SxProps;
};

export { noteImageStyle };
