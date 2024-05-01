import React from "react";
import type { PaletteMode } from "@mui/material";

function controlsStyle(theme: PaletteMode): React.CSSProperties {
    return {
        backgroundColor: theme === "light" ? "#52c4ff" : "#357dc8",
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

export { imgStyle, controlsStyle };
