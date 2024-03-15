import { HOVER_DARK, HOVER_LIGHT } from "5-app/settings";
import type { SxProps, PaletteMode } from "@mui/material";

function rowBody(theme: PaletteMode): SxProps {
    return {
        "&.Table__row_body:hover": {
            backgroundColor: theme === "light" ? HOVER_LIGHT : HOVER_DARK,
        },
    };
}

export { rowBody };
