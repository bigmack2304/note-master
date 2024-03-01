import type { SxProps, PaletteMode } from "@mui/material";
import { OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR } from "5-app/settings";

function loaderStyle(): SxProps {
    return {
        display: "block",
        margin: "0 auto",
    };
}

const dialogInnerListStyle = (theme: PaletteMode) => {
    return {
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
        width: "100%",

        "& .MuiFormControl-root": {
            width: "100%",
        },
    } as SxProps;
};

export { loaderStyle, dialogInnerListStyle };
