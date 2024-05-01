import { OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR } from "5-app/settings";
import type { SxProps, PaletteMode } from "@mui/material";

function dialogListStyle(theme: PaletteMode): SxProps {
    return {
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
    };
}

export { dialogListStyle };
