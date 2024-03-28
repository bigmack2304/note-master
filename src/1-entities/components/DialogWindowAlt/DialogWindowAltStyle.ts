import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import type { SxProps, PaletteMode } from "@mui/material";

function dialogTitleStyle(theme: PaletteMode): SxProps {
    return {
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    };
}

function dialogActionsStyle(theme: PaletteMode): SxProps {
    return {
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    } as SxProps;
}

export { dialogTitleStyle, dialogActionsStyle };
