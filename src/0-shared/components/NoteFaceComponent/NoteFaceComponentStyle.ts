import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import type { PaletteMode, SxProps } from "@mui/material";

function noteFaceComponentStyle(themeMode: PaletteMode, beforeContent: string = ""): SxProps {
    return {
        "&.NoteFaceComponent": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },
        "&.NoteFaceComponent::before": {
            content: `'${beforeContent}'`,
        },
    };
}

export { noteFaceComponentStyle };
