import type { PaletteMode, SxProps } from "@mui/material";

function resizableStyle(minSize: number, maxSize: number): SxProps {
    return {
        minWidth: `${minSize}px`,
        maxWidth: `${maxSize}px`,
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        touchAction: "none",
        overflow: "hidden",

        "&:has(.Resizable__controller--selected) .Resizable__contentSlot": {
            opacity: "50%",
        },

        "& .Resizable__ghost": {
            content: "''",
            position: "absolute",
            height: "100%",
            borderRight: "4px #000000 dotted",
            width: "1px",
            opacity: "50%",
            cursor: "col-resize",
            zIndex: "9999",
        },
    };
}

function slotStyle(): SxProps {
    return {
        width: "100%",
        height: "100%",
        overflow: "hidden",
    };
}

function resizableControllerStyle(theme: PaletteMode): SxProps {
    return {
        width: "7px",
        cursor: "col-resize",
        backgroundColor: theme === "light" ? "#1b1b1bd1" : "#1B1B1B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,

        "&::before": {
            content: "''",
            display: "block",
            width: "2px",
            height: "40%",
            backgroundColor: theme === "light" ? "#ffffffcf" : "#ffffff75",
        },

        "&.Resizable__controller--selected": {
            backgroundColor: "#1B1B1BB0",
        },
        "&.Resizable__controller--disabled": {
            backgroundColor: "#1B1B1B72",
            cursor: "no-drop",
            pointerEvents: "none",

            "&::before": {
                backgroundColor: theme === "light" ? "#ffffff85" : "#FFFFFF2A",
            },
        },
    };
}

export { resizableStyle, slotStyle, resizableControllerStyle };
