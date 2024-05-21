import { PaletteMode, SxProps } from "@mui/material";
import { fontThemeColor } from "2-features/utils/themeStylesOverride";

function customToolTipStyle(theme: PaletteMode): SxProps {
    return {
        "&.CustomToolTip .MuiTooltip-tooltip": {
            display: "flex",
            backgroundColor: theme === "light" ? "#E6E6E6" : "#3E3E3E",
            border: `1px ${theme === "light" ? "black" : "white"} solid`,
            color: fontThemeColor(theme),
        },

        "&.CustomToolTip .MuiTooltip-arrow": {
            color: theme === "light" ? "#E6E6E6" : "#3E3E3E",
        },
    };
}

export { customToolTipStyle };
