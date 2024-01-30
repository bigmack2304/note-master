import React from "react";
import { useTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

// возвращает текущий режим темы из текущего используемого обьекта темы materialUI

function useTemeMode(): PaletteMode {
    const theme = useTheme();
    return theme.palette.mode;
}

export { useTemeMode };
