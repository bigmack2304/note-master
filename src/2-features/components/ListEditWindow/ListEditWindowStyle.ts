import { PaletteMode, SxProps } from "@mui/material";
import { OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR } from "5-app/settings";

function dialogListStyle(theme: PaletteMode): SxProps {
    return {
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
    } as SxProps;
}

export { dialogListStyle };
