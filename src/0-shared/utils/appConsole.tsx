import { session_storage_save_value, get_session_stprage_data } from "./appSessionStorage";

/**
 * альтернатива console, выводит в лог сообщения, а также сохраняет их в session storage для дальнейшего использования в компонентах или других частях кода
 */
const appConsole = {
    log: (...data: any[]) => {
        let currentValue = get_session_stprage_data().appLogs;
        currentValue.push({ type: "log", value: String(...data) });
        currentValue = lengthVerify(currentValue);
        session_storage_save_value("appLogs", currentValue);
        console.log(...data);
    },
    user: (...data: any[]) => {
        let currentValue = get_session_stprage_data().appLogs;
        currentValue.push({ type: "user", value: String(...data) });
        currentValue = lengthVerify(currentValue);
        session_storage_save_value("appLogs", currentValue);
        console.log(...data);
    },
    warn: (...data: any[]) => {
        let currentValue = get_session_stprage_data().appLogs;
        currentValue.push({ type: "warn", value: String(...data) });
        currentValue = lengthVerify(currentValue);
        session_storage_save_value("appLogs", currentValue);
        console.warn(...data);
    },
    error: (...data: any[]) => {
        let currentValue = get_session_stprage_data().appLogs;
        currentValue.push({ type: "error", value: String(...data) });
        currentValue = lengthVerify(currentValue);
        session_storage_save_value("appLogs", currentValue);
        console.error(...data);
    },
};

// function inputData(value:any) {
//     let currentValue = get_session_stprage_data().appLogs;
//     currentValue.push({ type: "log", value: String(value) });
//     currentValue = lengthVerify(currentValue);
//     session_storage_save_value("appLogs", currentValue);
//     console.log(value);
// }

/**
 * укорачивает входящий массив вдвое если его длинна превышает 1000, возвращает либо укаороченный либо входящий массив
 */
function lengthVerify(arry: any[]) {
    let newArry: any[] = [];
    if (arry.length > 1000) {
        newArry = arry.toSpliced(0, 500);
        return newArry;
    }
    return arry;
}

export { appConsole };
