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
            overflow: "hidden",
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
        margin: "10px",
        flexGrow: 1,
        overflow: "auto",
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
}

function imgStyle(data: { isZoom: boolean; wrapper: HTMLDivElement | null; img: HTMLImageElement | null }): React.CSSProperties {
    let leftOffset = 0;
    let topOffset = 0;

    if (data.img && data.wrapper) {
        leftOffset = Math.floor((data.img.clientWidth * 2 - data.wrapper.clientWidth) / 4);
        topOffset = Math.max(0, Math.floor((data.img.clientHeight * 2 - data.wrapper.clientHeight) / 4)); // Math.max - если увеличенная картинка получится размером меньше wrapper, то она должна размещатся по центру
    }

    return {
        objectFit: "contain",
        maxWidth: "fit-content",
        minWidth: "340px",
        width: "100%",
        height: "auto",
        maxHeight: "85dvh",
        scale: data.isZoom ? "2" : "1",
        cursor: data.isZoom ? "zoom-out" : "zoom-in",

        ...(data.isZoom
            ? {
                  transform: `translate(${leftOffset}px, ${topOffset}px)`,
                  touchAction: "manipulation",
              }
            : {}),
    };
}

export { imgStyle, contentStyle, controlsStyle, backdropStyle };
