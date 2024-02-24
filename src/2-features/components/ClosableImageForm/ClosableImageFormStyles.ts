import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import type { PaletteMode, SxProps } from "@mui/material";

function сlosableImageFormStyles(theme: PaletteMode): SxProps {
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

function inputsStyles(theme: PaletteMode): SxProps {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center",
        justifyContent: "flex-end",
    };
}

function selectStyles(theme: PaletteMode): SxProps {
    return {
        minWidth: "176px",
    };
}

function buttonStyles(theme: PaletteMode): SxProps {
    return {
        alignSelf: "flex-start",
    };
}

function loadLocalInputsStyles(theme: PaletteMode): SxProps {
    return {
        flexGrow: 1,
        display: "grid",
        gridTemplateColumns: "auto auto",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
        overflow: "hidden",
    };
}

function fileNameStyles(theme: PaletteMode): SxProps {
    return {
        flexGrow: 1,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        maxWidth: "fit-content",
    };
}

function inputUrlStyle(): SxProps {
    return {
        paddingLeft: "4px",
        fontSize: "1.4rem",
        flexGrow: "1",
    };
}

function loadButtonStyle(): SxProps {
    return {
        maxWidth: "fitContent",
        justifySelf: "end",
    };
}

export { сlosableImageFormStyles, inputsStyles, selectStyles, buttonStyles, loadLocalInputsStyles, fileNameStyles, inputUrlStyle, loadButtonStyle };
