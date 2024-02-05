/**
 * проверяет текущую цветовую тему браузера
 */
function isDark() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme:dark)");
    return mediaQuery.matches;
}

/**
 * проверяет текущую цветовую тему браузера
 */
function isLight() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme:light)");
    return mediaQuery.matches;
}

export { isDark, isLight };
