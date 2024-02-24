import React from "react";
import type { SxProps, PaletteMode } from "@mui/material";

function backdropStyle(): SxProps {
    return {
        "&.FullScreenImagePrev": {
            backgroundColor: "#000000b3",
            backdropFilter: "blur(5px)",
            width: "100dvw",
            minWidth: "340px",
            height: "100dvh",
            display: "flex",
            zIndex: "5555",
            flexDirection: "column",
            flexWrap: "nowrap",
        },
        "&.FullScreenImagePrev .MuiPaper-root": {
            backgroundColor: "initial",
            alignItems: "center",
        },
    };
}

function controlsStyle(theme: PaletteMode): React.CSSProperties {
    return {
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: theme === "light" ? "#52c4ff" : "#357dc8",
        borderBottom: "1px #00000070 solid",
        width: "100%",
        padding: "10px",
    };
}

function contentStyle(): React.CSSProperties {
    return {
        padding: "10px",
        flexGrow: 1,
        overflow: "auto",
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
}

function imgStyle(): React.CSSProperties {
    return {
        objectFit: "contain",
        maxWidth: "fit-content",
        minWidth: "340px",
        width: "100%",
        height: "auto",
        maxHeight: "85dvh",
        //height: clamp(10%, 100%, 100dvh);
    };
}

export { imgStyle, contentStyle, controlsStyle, backdropStyle };
