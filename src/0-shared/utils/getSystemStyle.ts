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

/**
 * проверяет наличие устроиств ввода на клиенте а также точность этих устроиств
 * @ вернет true если точных устроиств ввода нету
 */
function inputDevice() {
    const mediaQuery = window.matchMedia("(any-hover: none)");
    return mediaQuery.matches;
}

/**
 * проверяет чтобы устройство ввода было тачскрином
 * @ вернет true если тачскрин
 */
function isTouchDevice() {
    const Query = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    return Query;
}

export { isDark, isLight, inputDevice, isTouchDevice };
