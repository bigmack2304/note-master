import { fontThemeColor } from "2-features/utils/themeStylesOverride";
import { SxProps } from "@mui/material";
import type { PaletteMode } from "2-features/utils/themeStylesOverride";

function textAreaStyle(theme: PaletteMode): SxProps {
    return {
        color: fontThemeColor(theme),
    };
}

export { textAreaStyle };
