import { createTheme } from "@mui/material/styles";
import type { IThemeState } from "5-app/GlobalState/themeStore";
import type { PaletteMode } from "@mui/material";

// переопределяет базовые стили material UI
// выставляет стили в зависимости от текущей темы

type TTheme = ReturnType<typeof createTheme>;

/**
 * цвет палитры primary (кнопки переключалки)
 * @param theme текущая тема
 * @returns
 */
function primaryThemeColor(theme: PaletteMode) {
    if (theme === "light") return "#288CEF";
    return "#e2e3e7";
}

/**
 * цвет палитры info
 * @param theme текущая тема
 * @returns
 */
function infoThemeColor(theme: PaletteMode) {
    if (theme === "light") return "#6DC2F3";
    return "#4E525C";
}

/**
 *  цвет background
 * @param theme текущая тема
 * @returns
 */
function backgroundThemeColor(theme: PaletteMode) {
    if (theme === "light") return "#fff";
    return "#292c31";
}

/**
 * цвет иконок
 * @param theme текущая тема
 * @returns
 */
function svgThemeColor(theme: PaletteMode) {
    return theme === "light" ? "#303030" : "#fbffff";
}

/**
 * цвет шрифта
 * @param theme текущая тема
 * @returns
 */
function textThemeColor(theme: PaletteMode) {
    if (theme === "light") return { primary: "#212121", secondary: "#666666", disabled: "#9e9e9e" };
    return { primary: "#fbffff", secondary: "#fcffff", disabled: "#fdffff" };
}

/**
 * цвет текста для Typography
 * @param theme текущая тема
 * @returns
 */
function fontThemeColor(theme: PaletteMode) {
    return theme === "light" ? "#212121" : "#fbffff";
}

/**
 * цвет текста для Chip
 * @param theme текущая тема
 * @returns
 */
function chipThemeColor(theme: PaletteMode) {
    return theme === "light" ? "#00000017" : "#00000059";
}

/**
 * переопределяет стандартные стили компонентов material ui
 * @param theme
 * @param themeValue текущая тема
 * @param storeTheme обьект настройки темы из redux store
 * @returns сконфигурированный обьект типа Theme
 */
function themeOverrideStyles(theme: TTheme, themeValue: PaletteMode, storeTheme: IThemeState) {
    let themeOverrided = createTheme(theme, {
        components: {
            MuiContainer: {
                styleOverrides: {
                    root: {
                        backgroundColor: !storeTheme.isDark ? theme.palette.background.default : "#434957",
                    },
                },
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        // применяем свой цвет только если он уже не задан через color
                        "&:not([class*=MuiSvgIcon-color])": {
                            color: svgThemeColor(themeValue),
                        },
                    },
                },
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        color: fontThemeColor(themeValue),
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        backgroundColor: chipThemeColor(themeValue),
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        "&.Mui-selected": {
                            backgroundColor: !storeTheme.isDark ? "#0092e74f" : "#00b4ff52",
                        },
                        "&.Mui-selected:hover": {
                            backgroundColor: !storeTheme.isDark ? "#0092e77d" : "#00b4ff1f",
                        },
                    },
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        // paddingRight: "7px",
                        // backgroundColor: !storeTheme.isDark ? "inherit" : "inherit",
                    },
                },
            },
            MuiDivider: {
                defaultProps: {},
            },
            MuiList: {
                styleOverrides: {
                    root: {
                        maxHeight: "35dvh",
                        overflow: "hidden",
                        overflowY: "auto",
                    },
                },
            },
        },
        palette: {
            primary: theme.palette.augmentColor({
                color: {
                    main: primaryThemeColor(themeValue),
                },
            }),
            info: theme.palette.augmentColor({
                color: {
                    main: infoThemeColor(themeValue),
                },
            }),
            background: {
                default: backgroundThemeColor(themeValue),
                paper: backgroundThemeColor(themeValue),
            },
            text: textThemeColor(themeValue),
            action: {
                active: !storeTheme.isDark ? "#000000" : "#FFFFFF",
                focus: !storeTheme.isDark ? "#00000022" : "#FFFFFF19",
                hover: !storeTheme.isDark ? "#00000022" : "#FFFFFF19",
                selected: !storeTheme.isDark ? "#000000" : "#FFFFFF",
                selectedOpacity: 0.02,
                hoverOpacity: 0.06,
                focusOpacity: 0.04,
                disabledOpacity: 0.5,
                activatedOpacity: 0.02,
            },
        },
    });

    // console.dir(themeOverrided);

    return themeOverrided;
}

export { themeOverrideStyles };
export type { PaletteMode, TTheme };
