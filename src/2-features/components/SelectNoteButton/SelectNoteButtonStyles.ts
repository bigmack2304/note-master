import { OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR } from "5-app/settings";
import type { PaletteMode, SxProps } from "@mui/material";

function dialogListStyle(theme: PaletteMode) {
    return {
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
        width: "100%",
    } as SxProps;
}

export { dialogListStyle };
