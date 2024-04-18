import type { IDataTreeRootFolder } from "0-shared/types/dataSave";
import type { TSavedIdGenerator } from "0-shared/utils/idGenerator";

// тип обьекта данных с функцией, для запуска этой функции в воркере
type TMessageDataType = {
    argument_names: string[];
    argument_values: any[];
    func_data: string;
    type: "function executor";
};

// тип обьекта для выполнения deleteById
type TMessageDelById = {
    type: "delete by id";
    data: IDataTreeRootFolder;
    target: string;
    savedIdGenerator: string[];
};

export type { TMessageDataType, TMessageDelById };
