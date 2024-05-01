import { OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR, CONTROLS_PRIMARY_LIGHT, CONTROLS_PRIMARY_DARK } from "5-app/settings";
import type { SxProps, PaletteMode } from "@mui/material";

function loaderStyle(): SxProps {
    return {
        display: "block",
        margin: "0 auto",
    };
}

function dialogInnerListStyle(theme: PaletteMode): SxProps {
    return {
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
        width: "100%",

        "& .MuiFormControl-root": {
            width: "100%",
        },
    };
}

function radioFormControlStyle(theme: PaletteMode): SxProps {
    return {
        "& .MuiButtonBase-root.MuiRadio-root.Mui-checked .MuiSvgIcon-root": {
            color: `${theme == "light" ? CONTROLS_PRIMARY_LIGHT : CONTROLS_PRIMARY_DARK}`,
        },
    };
}

export { loaderStyle, dialogInnerListStyle, radioFormControlStyle };
