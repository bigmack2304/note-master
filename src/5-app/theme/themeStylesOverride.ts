import { createTheme } from "@mui/material/styles";
import type { IThemeState } from "./themeStore";

// переопределяет базовые стили

type TTheme = ReturnType<typeof createTheme>;

// цвет primary (кнопки переключалки)
function primaryThemeColor(theme: "light" | "dark") {
    if (theme === "light") return "#288CEF";
    return "#e2e3e7";
}

// цвет info (поле над background)
function infoThemeColor(theme: "light" | "dark") {
    if (theme === "light") return "#6DC2F3";
    return "#4E525C";
}

// цвет background
function backgroundThemeColor(theme: "light" | "dark") {
    if (theme === "light") return "#fff";
    return "#292c31";
}

// цвет шрифта
function textThemeColor(theme: "light" | "dark") {
    if (theme === "light") return { primary: "#212121", secondary: "#666666", disabled: "#9e9e9e" };
    return { primary: "#fbffff", secondary: "#fcffff", disabled: "#fdffff" };
}

function themeOverrideStyles(theme: TTheme, themeValue: "light" | "dark", storeTheme: IThemeState) {
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
                        color: !storeTheme.isDark ? "#3A3A3A" : "#fdffff",
                    },
                },
            },
            MuiDivider: {
                defaultProps: {},
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
                active: !storeTheme.isDark ? "#FFFFFFE1" : "#FFFFFF",
                focus: !storeTheme.isDark ? "#DEDEDE" : "#F5F5F542",
                hover: !storeTheme.isDark ? "#DEDEDE" : "#F5F5F542",
                selected: !storeTheme.isDark ? "#ebebeb" : "#ebebeb",
            },
        },
    });

    //console.dir(themeOverrided);

    return themeOverrided;
}

export { themeOverrideStyles };
