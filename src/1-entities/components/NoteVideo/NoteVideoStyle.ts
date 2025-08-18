import type { PaletteMode, SxProps } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY, DRAG_ZONE_OUT_DARK, DRAG_ZONE_OUT_LIGHT } from "5-app/settings";

function videoWrapperStyle(themeMode: PaletteMode): SxProps {
    return {
        backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    };
}

function innerWrapperStyle(themeMode: PaletteMode): SxProps {
    return {
        "&.NoteVideo_inner_wrapper.dragZoneOut": {
            outline: `2px ${themeMode === "light" ? DRAG_ZONE_OUT_DARK : DRAG_ZONE_OUT_LIGHT}  dashed`,
        },
        "&.NoteVideo_inner_wrapper.dragZoneOk": {
            outline: `2px ${themeMode === "light" ? "black" : "white"}  solid`,
        },
        "&.NoteVideo_inner_wrapper.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    };
}

export { videoWrapperStyle, innerWrapperStyle };
