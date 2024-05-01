import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import type { PaletteMode, SxProps } from "@mui/material";

function dialogTitleStyle(theme: PaletteMode): SxProps {
    return {
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    };
}

function dialogActionsStyle(theme: PaletteMode): SxProps {
    return {
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    };
}

export { dialogTitleStyle, dialogActionsStyle };
