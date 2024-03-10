/**
 * удаляет добавляет подстроку в строку, если ее нет
 * @ применимо для модификации строки классов
 * @param classList строка
 * @param newClass добавляемая подстрока
 */
function stringAddClass(classList: string, newClass: string) {
    let temp: string[] | string = classList.split(" ");

    if (!temp.includes(newClass)) {
        temp.push(newClass);
    }

    temp = temp.join(" ");
    return temp;
}

/**
 * удаляет подстроку из строки, если она там была
 * @ применимо для модификации строки классов
 * @param classList строка
 * @param delClass удаляемая подстрока
 */
function stringRemoveClass(classList: string, delClass: string) {
    let temp: string[] | string = classList.split(" ");

    temp = temp.filter((value) => {
        if (value === delClass) return false;
        return true;
    });

    temp = temp.join(" ");
    return temp;
}

/**
 * генерирует хеш номер для строки
 *
 * @param str строка
 * @param seed сид
 */
function generateHashCode(str: string, seed: number = 0): string {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;

    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

export { stringAddClass, stringRemoveClass, generateHashCode };
