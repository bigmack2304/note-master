import type { SxProps, PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import { fontThemeColor } from "2-features/utils/themeStylesOverride";

function NotePhotoViewStyle(theme: PaletteMode): SxProps {
    return {
        "&.NotePhotoView.img_empty": {
            backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },

        "&.NotePhotoView.img_empty:before": {
            color: fontThemeColor(theme),
        },
    };
}

function innerWrapperStyle(theme: PaletteMode): SxProps {
    return {
        "&.NotePhotoView__out_wrapper.dragZoneOk": {
            outline: `2px ${theme === "light" ? "black" : "white"}  dashed`,
        },
        "&.NotePhotoView__out_wrapper.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    };
}

export { NotePhotoViewStyle, innerWrapperStyle };
