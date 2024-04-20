import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

/**
 *  тип обьекта данных с функцией, для запуска этой функции в воркере
 */
type TMessageDataType = {
    argument_names: string[];
    argument_values: any[];
    func_data: string;
    type: "function executor";
};

/**
 *  тип обьекта для выполнения deleteById в воркере
 */
type TMessageDelById = {
    type: "delete by id";
    data: IDataTreeRootFolder;
    target: string;
    savedIdGenerator: string[];
};

/**
 *  тип обьекта для выполнения deleteComponentInNote в воркере
 */
type TMessageDelCompInNote = {
    type: "delete component in note";
    rootFolder: IDataTreeRootFolder;
    noteID: string;
    componentID: string;
    savedIdGenerator: string[];
};

export type { TMessageDataType, TMessageDelById, TMessageDelCompInNote };
