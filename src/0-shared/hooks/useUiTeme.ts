import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "5-app";
import { createTheme } from "@mui/material/styles";
import { themeOverrideStyles } from "2-features";

// возвращает обьект темы material UI, автоматически меняет цвета темы в обьекте, операясь на глобальное состояние
// используется для провайдера темы

function useUiTeme() {
    let theme = createTheme({});
    const storeTheme = useSelector((state: RootState) => state.theme);
    const themeValue = storeTheme.isDark ? "dark" : "light";

    theme = createTheme(theme, {
        palette: {
            mode: themeValue,
        },
    });

    theme = themeOverrideStyles(theme, themeValue, storeTheme);

    return theme;
}

export { useUiTeme };
