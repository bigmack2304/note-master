import type {
    TMessageDataType,
    TMessageDelById,
    TMessageDelCompInNote,
    TMessageCloneFiltredTreeOnWorker,
    TMessageUpdateNodeValueOnWorker,
} from "./workerTypes";
import { isFunctionData, isDelByIdData, isDelCompInNote, isCloneFiltredTree, isUpdateNodeValue } from "0-shared/utils/typeHelpers";
import { deleteById } from "2-features/utils/saveDataEditFunctions/deleteById";
import { deleteComponentInNote } from "2-features/utils/saveDataEditFunctions/deleteComponentInNote";
import { cloneFiltredTree } from "0-shared/utils/note_find";
import { updateNodeValue } from "2-features/utils/saveDataEditFunctions/updateNoteValue";

/**
 * получение данных
 */
//eslint-disable-next-line
self.onmessage = (e: MessageEvent) => {
    const data = e.data;
    if (data && isFunctionData(data)) {
        funcExecutorCase(data);
    }
    if (data && isDelByIdData(data)) {
        delByIdCase(data);
    }
    if (data && isDelCompInNote(data)) {
        deleteComponentInNoteCase(data);
    }
    if (data && isCloneFiltredTree(data)) {
        cloneFiltredTreeCase(data);
    }
    if (data && isUpdateNodeValue(data)) {
        updateNodeValueCase(data);
    }
};

/**
 * отправка данных в рантайм
 */
function worker_postMessage(resolve: string = "", work_data: any = null) {
    //eslint-disable-next-line
    self.postMessage({
        resolve: resolve,
        work_data: work_data,
    });
}

/**
 * кейс с выполнением функции
 */
function funcExecutorCase({ argument_names = [], argument_values = [], func_data = "" }: TMessageDataType) {
    if (func_data) {
        worker_postMessage("Function executor: started");
        func_runer(argument_names, argument_values, func_data);
    }
}

/**
 * создание и выполнение полученной функции
 */
function func_runer(argument_names: string[], argument_values: any[], func_data: string) {
    try {
        const func = new Function(...argument_names, func_data);
        const result = func(...argument_values);
        worker_postMessage("Function executor: finished", result);
    } catch (e) {
        worker_postMessage("Function executor: error");
        console.error(e);
    }
}

/**
 * кейс с выполнением deleteById
 */
async function delByIdCase({ data, target, savedIdGenerator }: TMessageDelById) {
    try {
        worker_postMessage("delete by id: started");
        const result = await deleteById(data, target, savedIdGenerator);
        worker_postMessage("delete by id: finished", result);
    } catch (e) {
        worker_postMessage("delete by id: error");
        console.error(e);
    }
}

/**
 * кейс с выполнением deleteComponentInNote
 */
async function deleteComponentInNoteCase({ componentID, noteID, rootFolder, savedIdGenerator }: TMessageDelCompInNote) {
    try {
        worker_postMessage("delete component in note: started");
        const result = await deleteComponentInNote(rootFolder, noteID, componentID, savedIdGenerator);
        worker_postMessage("delete component in note: finished", result);
    } catch (e) {
        worker_postMessage("delete component in note: error");
        console.error(e);
    }
}

/**
 * кейс с выполнением cloneFiltredTree
 */
async function cloneFiltredTreeCase({ filtres, orig_obj }: TMessageCloneFiltredTreeOnWorker) {
    try {
        worker_postMessage("clone filtred tree: started");
        const result = await cloneFiltredTree(orig_obj, filtres);
        worker_postMessage("clone filtred tree: finished", result);
    } catch (e) {
        worker_postMessage("clone filtred tree: error");
        console.error(e);
    }
}

/**
 * кейс с выполнением UpdateNodeValue
 */
async function updateNodeValueCase({ componentId, newValue, noteId, rootFolder }: TMessageUpdateNodeValueOnWorker) {
    try {
        worker_postMessage("update node value: started");
        const result = await updateNodeValue(rootFolder, noteId, componentId, newValue);
        worker_postMessage("update node value: finished", result);
    } catch (e) {
        worker_postMessage("update node value: error");
        console.error(e);
    }
}
