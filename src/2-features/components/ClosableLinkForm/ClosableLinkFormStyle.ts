import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";

function closableLinkForm(theme: PaletteMode): SxProps {
    return {
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    };
}

export { closableLinkForm };
