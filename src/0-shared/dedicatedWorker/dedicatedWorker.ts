import type { TMessageDataType, TMessageDelById } from "./workerTypes";
import { isFunctionData, isDelByIdData } from "0-shared/utils/typeHelpers";
//import { deleteById } from "2-features/utils/saveDataEdit";

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
async function delByIdCase({ data, target }: TMessageDelById) {
    try {
        worker_postMessage("delete by id: started");
        //const result = await deleteById(data, target);
        const result = null;
        worker_postMessage("delete by id: finished", result);
    } catch (e) {
        worker_postMessage("delete by id: error");
        console.error(e);
    }
}
