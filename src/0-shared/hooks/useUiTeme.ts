import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "5-app";
import { createTheme } from "@mui/material/styles";

function useUiTeme() {
    let theme = createTheme({});
    const storeTheme = useSelector((state: RootState) => state.theme);
    const themeValue = storeTheme.isDark ? "dark" : "light";

    console.dir(theme);

    theme = createTheme(theme, {
        palette: {
            mode: themeValue,
        },
    });

    return theme;
}

export { useUiTeme };
