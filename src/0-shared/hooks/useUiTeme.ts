import React from "react";
import { useAppSelector } from "./useAppSelector";
import type { RootState } from "5-app/GlobalState/store";
import { createTheme } from "@mui/material/styles";
import { themeOverrideStyles } from "2-features/utils/themeStylesOverride";

/**
 *  возвращает обьект темы material UI, автоматически меняет цвета темы в обьекте, операясь на глобальное состояние.
 *  @ Используется для провайдера темы
 */
function useUiTeme() {
    let theme = createTheme({});
    const storeTheme = useAppSelector((state) => state.theme);
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
