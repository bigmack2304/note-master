import { HOVER_DARK, HOVER_LIGHT, CELL_SELECT_DARK, CELL_SELECT_LIGHT } from "5-app/settings";
import type { SxProps, PaletteMode } from "@mui/material";

function cell(theme: PaletteMode): SxProps {
    return {
        "&.Table__cell_select": {
            backgroundColor: theme === "light" ? CELL_SELECT_LIGHT : CELL_SELECT_DARK,
        },
    };
}

function rowBody(theme: PaletteMode): SxProps {
    return {
        "&.Table__row_body:hover": {
            backgroundColor: theme === "light" ? HOVER_LIGHT : HOVER_DARK,
        },
    };
}

export { rowBody, cell };
