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

export { stringAddClass, stringRemoveClass };
