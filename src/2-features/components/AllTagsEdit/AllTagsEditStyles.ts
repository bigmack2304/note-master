import { OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR } from "5-app/settings";
import type { SxProps, PaletteMode } from "@mui/material";

function loaderStyle(): SxProps {
    return {
        display: "block",
        margin: "0 auto",
    };
}

const dialogInnerListStyle = (theme: PaletteMode) => {
    return {
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
    } as SxProps;
};

export { dialogInnerListStyle, loaderStyle };
