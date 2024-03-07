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

/*
    возврощает true если на устройстве мультитач
    (для пк в 98% вернет false, тк мало у кого сенсорный экран)
*/
function is_multiTuch(): boolean {
    if (window.navigator.maxTouchPoints > 0) {
        // > 1
        return true;
    }
    return false;
}

export { isDark, isLight, is_multiTuch };
