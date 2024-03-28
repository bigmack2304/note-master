import {
    HOVER_DARK,
    HOVER_LIGHT,
    CELL_SELECT_DARK,
    CELL_SELECT_LIGHT,
    ACTIVE_CELL_LIGHT,
    ACTIVE_CELL_DARK,
    TABLE_CONTROLS_BG_DARK,
    TABLE_CONTROLS_BORDER_DARK,
    THEME_DARK_GRAY,
} from "5-app/settings";
import type { SxProps, PaletteMode } from "@mui/material";
import type { TBodyComponentTable } from "0-shared/types/dataSave";

function cell(theme: PaletteMode): SxProps {
    return {
        "&.Table__cell_select": {
            backgroundColor: theme === "light" ? CELL_SELECT_LIGHT : CELL_SELECT_DARK,
        },

        "&:has(.Mui-focused)": {
            backgroundColor: theme === "light" ? ACTIVE_CELL_LIGHT : ACTIVE_CELL_DARK,
        },
    };
}

function rowBody(theme: PaletteMode): SxProps {
    return {
        "&.Table__row_body.MuiBox-root:hover": {
            // .MuiBox-root нужно полднять спецыфичность селектора
            backgroundColor: theme === "light" ? HOVER_LIGHT : HOVER_DARK,
        },
    };
}

function tableStyle(theme: PaletteMode): SxProps {
    return {
        backgroundColor: theme === "light" ? "transparent" : THEME_DARK_GRAY,

        "& > .Table__controls": {
            backgroundColor: theme === "light" ? "white" : TABLE_CONTROLS_BG_DARK,
            border: theme === "light" ? "initial" : `1px ${TABLE_CONTROLS_BORDER_DARK} solid`,
        },
    };
}

function tableBody(theme: PaletteMode, backLight: TBodyComponentTable["backlight"]): SxProps {
    return {
        ...(backLight
            ? {
                  "& > .Table__row_body:nth-of-type(2n + 1)": {
                      backgroundColor: theme == "light" ? "#a8a8a817" : "#a8a8a817",
                  },
              }
            : {}),
    };
}

export { rowBody, cell, tableStyle, tableBody };
