/**
 * Проверка на отсутствие глобольногоо обьекта window
 */
function isNotWindow() {
    return typeof window === "undefined";
}

/**
 * проверка что окружение self есть и оно пренадлежить Dedicated Worker
 */
function isDWorkerScope() {
    //eslint-disable-next-line
    return typeof self === "object" && self.toString() === "[object DedicatedWorkerGlobalScope]";
}

export { isNotWindow, isDWorkerScope };
