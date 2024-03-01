import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";

function boxStyles(theme: PaletteMode): SxProps {
    return {
        padding: "3px",
        fontSize: "2rem",
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        borderRadius: "2px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        boxShadow: "0px 1px 4px -2px black",
        width: "fit-content",
        columnGap: "3px",
    };
}

function inputStyle(): SxProps {
    return {
        paddingLeft: "4px",
        fontSize: "1.4rem",
        width: "100%",
    };
}

function selectStyle(): SxProps {
    return { minWidth: "118px" };
}

export { boxStyles, inputStyle, selectStyle };
