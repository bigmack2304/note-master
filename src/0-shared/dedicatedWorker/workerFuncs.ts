import type { TMessageDataType, TMessageDelById } from "./workerTypes";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";
import type { TReturnTypeDeleteById } from "2-features/utils/saveDataEdit";

// скрипт содержит различные функции для удобного более удобного взаимодействия с воркером, запуска конкретных задачь в нем.

/**
 * запускает функцию с указанными параметрами в воркере
 */
function runFuncOnWorker<T extends (...args: any[]) => any>(workerObj: Worker, func: T, ...args_for_func: Parameters<T>) {
    return new Promise<ReturnType<typeof func>>((resolve, reject) => {
        const callback = (e: MessageEvent) => {
            if (e.data.resolve && e.data.resolve === "Function executor: finished") {
                resolve(e.data.work_data);
                workerObj.removeEventListener("message", callback);
            }

            if (e.data.resolve && e.data.resolve === "Function executor: error") {
                reject("Function executor: error");
                workerObj.removeEventListener("message", callback);
            }
        };

        workerObj.addEventListener("message", callback);

        workerObj.postMessage({ ...func_convertTo_string(func, ...args_for_func), type: "function executor" } as TMessageDataType);
    });
}

/**
 * преобразует функцию и массив параметров в обьект типа Omit<TMessageDataType, "type">
 * возвращаемый обьект позволит нам использовать такой код...
 *
 * function foo(val1, val2) {
 *   return val1 + val2;
 * }
 *
 * либо
 *
 * const foo = (val1, val2) => {
 *   return val1 + val2;
 * }
 *
 * let fooToObj = func_convertTo_string(foo, 2, 2);
 * let funcResult = new Function(...fooToObj.argument_names, fooToObj.func_data)(...fooToObj.argument_values);
 */
function func_convertTo_string(func: Function, ...args: any[]) {
    let obj_function: Omit<TMessageDataType, "type"> = {
        argument_names: [],
        argument_values: [...args],
        func_data: "",
    };

    let str = String(func).split("\n"); // преобразуем функцию в строку, а далее в массив (каждая строка -> элемент массива)

    str = str.filter((item) => {
        // удалить пустые ячейки
        if (item != "") {
            return true;
        }
    });

    str = str.map((item) => {
        // удалить лишние пробелы для каждого элемента
        return item.trim();
    });

    str = str.slice(0, str.length - 1); // удалить последнюю фигурную скобку в конце
    obj_function.func_data = str.slice(1).join("\n"); // начинаем запись тела функции
    str = str.slice(0, 1); // теперь оставим только первую строку, будем работать с ней
    let firstString = str.join(); // преобразовать массив в строку
    firstString = firstString.slice(firstString.indexOf("(") + 1, firstString.indexOf(")")); // оставляем в строке только все что было в круглых скобках
    str = firstString.split(","); // преобразуем это в массив по разделителю ,

    if (str.length > 0) {
        obj_function.argument_names = str;
    }
    return obj_function;
}

// запуск в воркере алгоритма deleteById из saveDataEdit.ts
function deleteByIdOnWorker(workerObj: Worker, data: IDataTreeRootFolder, target_id: string) {
    return new Promise<TReturnTypeDeleteById>((resolve, reject) => {
        const callback = (e: MessageEvent) => {
            if (e.data.resolve && e.data.resolve === "delete by id: finished") {
                resolve(e.data.work_data);
                workerObj.removeEventListener("message", callback);
            }

            if (e.data.resolve && e.data.resolve === "delete by id: error") {
                reject("delete by id: error");
                workerObj.removeEventListener("message", callback);
            }
        };

        workerObj.addEventListener("message", callback);

        workerObj.postMessage({ data, target: target_id, type: "delete by id" } as TMessageDelById);
    });
}

export { runFuncOnWorker, deleteByIdOnWorker };
