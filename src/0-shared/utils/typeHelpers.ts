import { ForwardRefRenderFunction } from "react";
import type { IDataTreeNote, IDataTreeFolder, TNoteBody, IDataSave } from "0-shared/types/dataSave";
import type { TMessageDataType } from "0-shared/dedicatedWorker/workerTypes";

/**
 *  убирает своиство readonly у полей массива или обьекта
 */
type RemoveReadonly<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
 * вычисляет пропсы компонента
 * @tparam T - тип компонента
 */
type GetProps<T> = T extends React.ComponentType<infer Props> ? Props : unknown;

/**
 * типизирует параметр ref в компоненте, если используется forwardRef
 * @tparam T - тип элемента на который перенаправляется ref (например HTMLInputElement)
 */
type Ref<T> = Parameters<ForwardRefRenderFunction<T>>[1];

/**
 * проверяет чтобы сущьность пренадлежала к типу IDataTreeNote
 * @param node
 * @returns boolean
 */
function isDataTreeNote(node: any): node is IDataTreeNote {
    if (typeof node !== "object") return false;
    if (!("type" in node)) return false;
    return node.type === "note";
}

/**
 * проверяет чтобы сущьность пренадлежала к типу IDataTreeFolder
 * @param node
 * @returns boolean
 */
function isDataTreeFolder(node: any): node is IDataTreeFolder {
    if (typeof node !== "object") return false;
    if (!("type" in node)) return false;
    return node.type === "folder";
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TNoteBody
 * @param node
 * @returns boolean
 */
function isDataNoteBody(node: any): node is TNoteBody {
    if (typeof node !== "object") return false;
    if (!("type" in node)) return false;
    return node.type === "component";
}

/**
 * проверяет чтобы сущьность пренадлежала к типу IDataSave
 * @param node
 * @returns boolean
 */
function isDataSave(node: any): node is IDataSave {
    if (typeof node !== "object") return false;
    if (!("db_type" in node)) return false;
    if (!("data_tree" in node)) return false;
    if (!("global_tags" in node)) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageDataType dedicated воркера
 */
function isFunctionData(value: any): value is TMessageDataType {
    if (typeof value !== "object") return false;
    if (!("argument_names" in value)) return false;
    if (!("argument_values" in value)) return false;
    if (!("func_data" in value)) return false;
    if (!("type" in value)) return false;
    if (!Array.isArray(value.argument_names)) return false;
    if (!Array.isArray(value.argument_values)) return false;
    return true;
}

export { isDataTreeNote, isDataTreeFolder, isDataNoteBody, isDataSave, isFunctionData };
export type { GetProps, Ref, RemoveReadonly };
