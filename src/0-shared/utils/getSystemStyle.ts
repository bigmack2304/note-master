function isDark() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme:dark)");
    return mediaQuery.matches;
}

function isLight() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme:light)");
    return mediaQuery.matches;
}

export { isDark, isLight };
