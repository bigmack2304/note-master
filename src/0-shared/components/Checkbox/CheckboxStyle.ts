import { CONTROLS_PRIMARY_LIGHT, CONTROLS_PRIMARY_DARK } from "5-app/settings";
import type { SxProps, PaletteMode } from "@mui/material";

function checkboxLabel(theme: PaletteMode): SxProps {
    return {
        "&.Checkbox__checkbox .MuiSvgIcon-root": {
            color: theme === "light" ? CONTROLS_PRIMARY_LIGHT : CONTROLS_PRIMARY_DARK,
        },
    };
}

export { checkboxLabel };
