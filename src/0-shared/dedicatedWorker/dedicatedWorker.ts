import type { TMessageDataType } from "./workerTypes";
import { isFunctionData } from "0-shared/utils/typeHelpers";

/**
 * получение данных
 */
//eslint-disable-next-line
self.onmessage = (e: MessageEvent) => {
    const data = e.data;
    // данные с функцией и параметрами для ее выполнения
    if (data && isFunctionData(data)) {
        funcExecutorCase(data);
    }
};

/**
 * отправка данных в рантайм
 */
function worker_postMessage(resolve = "", work_data = null) {
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
        worker_postMessage("Function executor started");
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
        worker_postMessage("Function executor finished", result);
    } catch (e) {
        worker_postMessage("Function executor error");
        console.error(e);
    }
}
