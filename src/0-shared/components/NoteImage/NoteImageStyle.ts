import type { CSSProperties } from "react";
import type { SxProps, PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";

const noteImageStyle = (isChildren: boolean, theme: PaletteMode) => {
    return {
        width: "100%",
        overflow: "hidden",
        fontSize: "1rem",

        ...(isChildren
            ? {}
            : {
                  minHeight: "3rem",
                  backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
                  borderRadius: "3px",
              }),

        "&.NoteImage--editable:hover": {
            outline: "1px red solid",
        },
    } as SxProps;
};

function imageLoaderStyle(): SxProps {
    return {
        display: "block",
        margin: "0 auto",
    };
}

function imageDescStyle(): SxProps {
    return {
        textAlign: "center",
        fontStyle: "italic",
    };
}

function imageStyle(): CSSProperties {
    return {
        width: "100%",
        maxHeight: "400px",
        objectFit: "contain",
    };
}

function imageWrapperStyle(): CSSProperties {
    return {
        margin: "5px",
    };
}

export { noteImageStyle, imageLoaderStyle, imageDescStyle, imageStyle, imageWrapperStyle };
