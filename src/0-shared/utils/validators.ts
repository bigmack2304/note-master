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

export { checkForStartSpace, checkForSymbols, nameValidator, lengthValidator };
