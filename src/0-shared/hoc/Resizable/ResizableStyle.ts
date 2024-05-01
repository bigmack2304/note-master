import type { PaletteMode, SxProps } from "@mui/material";

function resizableStyle(minSize: number): SxProps {
    return {
        minWidth: `${minSize}px`,
    };
}

function resizableControllerStyle(theme: PaletteMode): SxProps {
    return {
        backgroundColor: theme === "light" ? "#1b1b1bd1" : "#1B1B1B",

        "&::before": {
            backgroundColor: theme === "light" ? "#ffffffcf" : "#ffffff75",
        },

        "&.Resizable__controller--disabled": {
            "&::before": {
                backgroundColor: theme === "light" ? "#ffffff85" : "#FFFFFF2A",
            },
        },
    };
}

export { resizableStyle, resizableControllerStyle };
