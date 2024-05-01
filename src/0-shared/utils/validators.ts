/**
 * вернет true если в строке есть чтото кроме пробелов, букв, цыфр
 * @param str проверяемая строка
 */
function checkForSymbols(str: string) {
    const regex = /[^\w\s\d[а-я А-Я]/g;
    return regex.test(str);
}

/**
 * вернет true если строка начинается с пробела
 * @param str проверяемая строка
 */
function checkForStartSpace(str: string) {
    const regex = /^\s/g;
    return regex.test(str);
}

/**
 * вернет true если в строке нету символов кроме (цыфр, пробелов не в начале строки, букв, нижнего подчеркивания)
 * @param str проверяемая строка
 */
function nameValidator(str: string) {
    return Boolean(!checkForStartSpace(str) && !checkForSymbols(str));
}

function lengthValidator(str: string, maxLen: number) {
    return str.length < maxLen;
}

/**
 * возвращает true если строка не начинается с data: (тоесть если это не ссылка на blob)
 * @param str проверяемая строка
 */
function isNoDataUrl(str: string) {
    return !str.startsWith("data:");
}

/**
 * возвращает true если строку можно считать как url
 * @param str проверяемая строка
 */
function isUrl(str: string) {
    let result = false;

    if (str === "") return result;

    try {
        let url = new URL(str);
        result = Boolean(url.protocol !== "" && url.host !== "");
    } catch {
        result = false;
    }

    return result;
}

export { checkForStartSpace, checkForSymbols, nameValidator, lengthValidator, isNoDataUrl, isUrl };
