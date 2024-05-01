import { TOOLBAR_BG_DARK_COLOR, TOOLBAR_BG_LIGHT_COLOR, TOOLBAR_BORDER_DARK_COLOR, TOOLBAR_BORDER_LIGHT_COLOR } from "5-app/settings";
import type { SxProps, PaletteMode } from "@mui/material";

function toolbarStyle(theme: PaletteMode): SxProps {
    const style: SxProps = {
        backgroundColor: theme === "light" ? TOOLBAR_BG_LIGHT_COLOR : TOOLBAR_BG_DARK_COLOR,
        borderBottom: `1px ${theme === "light" ? TOOLBAR_BORDER_LIGHT_COLOR : TOOLBAR_BORDER_DARK_COLOR} solid`,
    };

    return style;
}

export { toolbarStyle };
