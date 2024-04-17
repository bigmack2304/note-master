import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

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
};

export type { TMessageDataType, TMessageDelById };
