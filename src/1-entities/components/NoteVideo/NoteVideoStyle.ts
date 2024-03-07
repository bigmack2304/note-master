import type { PaletteMode, SxProps } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";

function videoWrapperStyle(themeMode: PaletteMode): SxProps {
    return {
        backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,

        "&.NoteVideo.dragZoneOk": {
            outline: `2px ${themeMode === "light" ? "black" : "white"}  dashed`,
        },
        "&.NoteVideo.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    };
}

export { videoWrapperStyle };
