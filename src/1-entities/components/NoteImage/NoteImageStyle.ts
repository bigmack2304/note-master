import type { CSSProperties } from "react";
import type { SxProps, PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import { fontThemeColor } from "2-features/utils/themeStylesOverride";

const noteImageStyle = (isChildren: boolean, theme: PaletteMode) => {
    return {
        width: "100%",
        overflow: "hidden",
        fontSize: "1rem",

        "&.NoteImage.img_empty": {
            flexDirection: "column",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "3rem",
            backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
            borderRadius: "3px",
        },

        "&.NoteImage.img_empty:before": {
            fontSize: "1rem",
            content: "'Изображение'",
            opacity: "50%",
            color: fontThemeColor(theme),
        },

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
