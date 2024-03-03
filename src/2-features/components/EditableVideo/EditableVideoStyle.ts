import type { PaletteMode, SxProps } from "@mui/material";
import { CSSProperties } from "react";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";

function videoWrapperStyle(themeMode: PaletteMode): SxProps {
    return {
        backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    };
}

export { videoWrapperStyle };
