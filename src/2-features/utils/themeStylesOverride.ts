import { createTheme } from "@mui/material/styles";
import { MOBILE_SCREEN_MIN, TABLET_SCREEN_MIN, DESCTOP_SCREEN_MIN } from "5-app/settings";
import type { IThemeState } from "5-app/GlobalState/themeStore";
import type { PaletteMode } from "@mui/material";

// переопределяет базовые стили material UI
// выставляет стили в зависимости от текущей темы

type TTheme = ReturnType<typeof createTheme>;

// это фигню можно импортировать из material
// переопределение стандартных breakpoint
declare module "@mui/material/styles" {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        md: true;
        lg: true;
        xl: true;
        mobile: true; // adds the breakpoint
        tablet: true; // adds the breakpoint
        desktop: true; // adds the breakpoint
    }
}

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
    return theme === "light" ? "#212121" : "#E7E7E7";
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
                        color: fontThemeColor(themeValue),
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
                    deleteIcon: {
                        color: "#21212169",
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
                        //maxHeight: "35dvh",
                        overflow: "hidden",
                        overflowY: "auto",
                    },
                },
            },
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        "&.Mui-disabled .MuiSvgIcon-root": {
                            color: "#00000048",
                        },
                    },
                },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    root: {
                        backgroundColor: "#f5f5f5",
                    },
                    bar: {
                        backgroundColor: themeValue === "light" ? "#248b29" : "#000f65",
                    },
                },
            },
            MuiTreeView: {
                styleOverrides: {
                    root: {
                        "& .MuiTreeItem-root .CustomTreeItemContent.Mui-selected": {
                            backgroundColor: themeValue === "light" ? "#288bef52" : "#00000045",
                        },
                        "& .MuiTreeItem-root .CustomTreeItemContent.Mui-selected.Mui-focused": {
                            backgroundColor: themeValue === "light" ? "#288BEF8D" : "#0000005E",
                        },
                        "& .MuiTreeItem-root .CustomTreeItemContent.Mui-focused": {
                            backgroundColor: themeValue === "light" ? "#288BEF8D" : "#0000005E",
                        },
                    },
                },
            },
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        "&": {
                            backdropFilter: "blur(5px)",
                        },
                    },
                },
            },
            MuiCircularProgress: {
                styleOverrides: {
                    root: {
                        display: "block",
                        margin: "0 auto",
                    },
                },
            },
            // глобальные стили
            MuiCssBaseline: {
                styleOverrides: {
                    body: {},
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
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
                mobile: MOBILE_SCREEN_MIN, // (0 - (MIN_FULLSCREEN_W - 1))
                tablet: TABLET_SCREEN_MIN, // (MIN_FULLSCREEN_W - 1199)
                desktop: DESCTOP_SCREEN_MIN, // 1200 - ∞
            },
        },
    });

    return themeOverrided;
}

export { themeOverrideStyles, svgThemeColor, fontThemeColor };
export type { PaletteMode, TTheme };
