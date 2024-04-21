import type {
    TMessageDataType,
    TMessageDelById,
    TMessageDelCompInNote,
    TMessageCloneFiltredTreeOnWorker,
    TMessageUpdateNodeValueOnWorker,
    TMessageUpdateNodeImageOnWorker,
    TMessageUpdNoteComponentsOrderOnWorker,
    TMessageUpdateNodeTableOnWorker,
} from "./workerTypes";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";
import type { TReturnTypeDeleteById } from "2-features/utils/saveDataEditFunctions/deleteById";
import { TReturnTypeDeleteComponentInNote } from "2-features/utils/saveDataEditFunctions/deleteComponentInNote";
import type { TReturnTypeCloneFiltredTree } from "0-shared/utils/note_find";
import type { IFindNodeParametres } from "5-app/GlobalState/toolBarStore";
import type { TReturnTypeUpdateNodeValue } from "2-features/utils/saveDataEditFunctions/updateNoteValue";
import type { TReturnTypeUpdNoteComponentsOrder } from "2-features/utils/saveDataEditFunctions/updNoteComponentsOrder";
import type { TReturnTypeUpdateNodeImage } from "2-features/utils/saveDataEditFunctions/updateNoteImage";
import type { TReturnTypeUpdateNodeTable } from "2-features/utils/saveDataEditFunctions/updateNodeTable";
import type { TTableValue } from "0-shared/types/dataSave";

// скрипт содержит различные функции для более удобного взаимодействия с воркером, запуска конкретных задачь в нем.

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

/**
 * запуск в воркере алгоритма deleteById из saveDataEdit.ts
 */
function deleteByIdOnWorker(workerObj: Worker, data: IDataTreeRootFolder, target_id: string, savedIdGenerator: string[]) {
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
        workerObj.postMessage({ data, target: target_id, type: "delete by id", savedIdGenerator } as TMessageDelById);
    });
}

/**
 * запуск в воркере алгоритма deleteComponentInNote из saveDataEdit.ts
 */
function deleteComponentInNoteOnWorker(
    workerObj: Worker,
    rootFolder: IDataTreeRootFolder,
    noteID: string,
    componentID: string,
    savedIdGenerator: string[]
) {
    return new Promise<TReturnTypeDeleteComponentInNote>((resolve, reject) => {
        const callback = (e: MessageEvent) => {
            if (e.data.resolve && e.data.resolve === "delete component in note: finished") {
                resolve(e.data.work_data);
                workerObj.removeEventListener("message", callback);
            }

            if (e.data.resolve && e.data.resolve === "delete component in note: error") {
                reject("delete component in note: error");
                workerObj.removeEventListener("message", callback);
            }
        };

        workerObj.addEventListener("message", callback);
        workerObj.postMessage({
            rootFolder,
            noteID,
            type: "delete component in note",
            componentID,
            savedIdGenerator,
        } as TMessageDelCompInNote);
    });
}

/**
 * запуск в воркере алгоритма cloneFiltredTree
 */
function cloneFiltredTreeOnWorker(workerObj: Worker, orig_obj: IDataTreeRootFolder, filtres: IFindNodeParametres | undefined) {
    return new Promise<TReturnTypeCloneFiltredTree>((resolve, reject) => {
        const callback = (e: MessageEvent) => {
            if (e.data.resolve && e.data.resolve === "clone filtred tree: finished") {
                resolve(e.data.work_data);
                workerObj.removeEventListener("message", callback);
            }

            if (e.data.resolve && e.data.resolve === "clone filtred tree: error") {
                reject("clone filtred tree: error");
                workerObj.removeEventListener("message", callback);
            }
        };

        workerObj.addEventListener("message", callback);
        workerObj.postMessage({
            type: "clone filtred tree",
            orig_obj,
            filtres,
        } as TMessageCloneFiltredTreeOnWorker);
    });
}

/**
 * запуск в воркере алгоритма updateNodeValue
 */
function updateNodeValueOnWorker(
    workerObj: Worker,
    rootFolder: IDataTreeRootFolder,
    noteId: string,
    componentId: string,
    newValue: string
) {
    return new Promise<TReturnTypeUpdateNodeValue>((resolve, reject) => {
        const callback = (e: MessageEvent) => {
            if (e.data.resolve && e.data.resolve === "update node value: finished") {
                resolve(e.data.work_data);
                workerObj.removeEventListener("message", callback);
            }

            if (e.data.resolve && e.data.resolve === "update node value: error") {
                reject("update node value: error");
                workerObj.removeEventListener("message", callback);
            }
        };

        workerObj.addEventListener("message", callback);
        workerObj.postMessage({
            type: "update node value",
            rootFolder,
            noteId,
            componentId,
            newValue,
        } as TMessageUpdateNodeValueOnWorker);
    });
}

/**
 * запуск в воркере алгоритма updNoteComponentsOrder
 */
function updNoteComponentsOrderOnWorker(
    workerObj: Worker,
    rootFolder: IDataTreeRootFolder,
    noteId: string,
    componentDragId: string,
    toComponentDragId: string
) {
    return new Promise<TReturnTypeUpdNoteComponentsOrder>((resolve, reject) => {
        const callback = (e: MessageEvent) => {
            if (e.data.resolve && e.data.resolve === "update note components order: finished") {
                resolve(e.data.work_data);
                workerObj.removeEventListener("message", callback);
            }

            if (e.data.resolve && e.data.resolve === "update note components order: error") {
                reject("update note components order: error");
                workerObj.removeEventListener("message", callback);
            }
        };

        workerObj.addEventListener("message", callback);
        workerObj.postMessage({
            type: "update note components order",
            rootFolder,
            noteId,
            componentDragId,
            toComponentDragId,
        } as TMessageUpdNoteComponentsOrderOnWorker);
    });
}

/**
 * запуск в воркере алгоритма updateNodeImage
 */
function updateNodeImageOnWorker(
    workerObj: Worker,
    rootFolder: IDataTreeRootFolder,
    noteId: string,
    componentId: string,
    newSrc: string,
    newName: string
) {
    return new Promise<TReturnTypeUpdateNodeImage>((resolve, reject) => {
        const callback = (e: MessageEvent) => {
            if (e.data.resolve && e.data.resolve === "update node image: finished") {
                resolve(e.data.work_data);
                workerObj.removeEventListener("message", callback);
            }

            if (e.data.resolve && e.data.resolve === "update node image: error") {
                reject("update node image: error");
                workerObj.removeEventListener("message", callback);
            }
        };

        workerObj.addEventListener("message", callback);
        workerObj.postMessage({
            type: "update node image",
            rootFolder,
            noteId,
            componentId,
            newSrc,
            newName,
        } as TMessageUpdateNodeImageOnWorker);
    });
}

/**
 * запуск в воркере алгоритма updateNodeTable
 */
function updateNodeTableOnWorker(
    workerObj: Worker,
    rootFolder: IDataTreeRootFolder,
    noteId: string,
    componentId: string,
    newValue: TTableValue | ""
) {
    return new Promise<TReturnTypeUpdateNodeTable>((resolve, reject) => {
        const callback = (e: MessageEvent) => {
            if (e.data.resolve && e.data.resolve === "update node table: finished") {
                resolve(e.data.work_data);
                workerObj.removeEventListener("message", callback);
            }

            if (e.data.resolve && e.data.resolve === "update node table: error") {
                reject("update node table: error");
                workerObj.removeEventListener("message", callback);
            }
        };

        workerObj.addEventListener("message", callback);
        workerObj.postMessage({
            type: "update node table",
            rootFolder,
            noteId,
            componentId,
            newValue,
        } as TMessageUpdateNodeTableOnWorker);
    });
}

export {
    runFuncOnWorker,
    deleteByIdOnWorker,
    deleteComponentInNoteOnWorker,
    cloneFiltredTreeOnWorker,
    updateNodeValueOnWorker,
    updNoteComponentsOrderOnWorker,
    updateNodeImageOnWorker,
    updateNodeTableOnWorker,
};
