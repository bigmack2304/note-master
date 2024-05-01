import { PaletteMode, SxProps } from "@mui/material";
import { OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR } from "5-app/settings";

const dialogTableStyle = (theme: PaletteMode) => {
    return {
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
    } as SxProps;
};

export { dialogTableStyle };
