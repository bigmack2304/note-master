import { ForwardRefRenderFunction } from "react";
import type { IDataTreeNote, IDataTreeFolder, TNoteBody, IDataSave } from "0-shared/types/dataSave";
import type {
    TMessageDataType,
    TMessageDelById,
    TMessageDelCompInNote,
    TMessageCloneFiltredTreeOnWorker,
    TMessageUpdateNodeValueOnWorker,
    TMessageUpdNoteComponentsOrderOnWorker,
    TMessageUpdateNodeImageOnWorker,
    TMessageUpdateNodeTableOnWorker,
} from "0-shared/dedicatedWorker/workerTypes";
import type { TTableValue } from "0-shared/types/dataSave";

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
 * проверяет чтобы сущьность пренадлежала к типу TTableValue
 * @returns boolean
 */
function isTableValue(value: any): value is TTableValue {
    if (typeof value !== "object") return false;
    if (!("headers" in value) || ("headers" in value && !Array.isArray(value.headers))) return false;
    if (!("rows" in value) || ("rows" in value && !Array.isArray(value.rows))) return false;
    return true;
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
    if (!("type" in value) || ("type" in value && value.type !== "function executor")) return false;
    if (!Array.isArray(value.argument_names)) return false;
    if (!Array.isArray(value.argument_values)) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageDelById dedicated воркера
 */
function isDelByIdData(value: any): value is TMessageDelById {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "delete by id")) return false;
    if (!("data" in value) || ("data" in value && !isDataTreeFolder(value.data))) return false;
    if (!("target" in value) || ("target" in value && typeof value.target !== "string")) return false;
    if (!("savedIdGenerator" in value) || ("savedIdGenerator" in value && !Array.isArray(value.savedIdGenerator))) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageDelCompInNote dedicated воркера
 */
function isDelCompInNote(value: any): value is TMessageDelCompInNote {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "delete component in note")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("componentID" in value) || ("componentID" in value && typeof value.componentID !== "string")) return false;
    if (!("savedIdGenerator" in value) || ("savedIdGenerator" in value && !Array.isArray(value.savedIdGenerator))) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageDelCompInNote dedicated воркера
 */
function isCloneFiltredTree(value: any): value is TMessageCloneFiltredTreeOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "clone filtred tree")) return false;
    if (!("orig_obj" in value) || ("orig_obj" in value && !isDataTreeFolder(value.orig_obj))) return false;
    if (!("filtres" in value)) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNodeValueOnWorker dedicated воркера
 */
function isUpdateNodeValue(value: any): value is TMessageUpdateNodeValueOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node value")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("newValue" in value) || ("newValue" in value && typeof value.newValue !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdNoteComponentsOrderOnWorker dedicated воркера
 */
function isUpdNoteComponentsOrder(value: any): value is TMessageUpdNoteComponentsOrderOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update note components order")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentDragId" in value) || ("componentDragId" in value && typeof value.componentDragId !== "string")) return false;
    if (!("toComponentDragId" in value) || ("toComponentDragId" in value && typeof value.toComponentDragId !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdNoteComponentsOrderOnWorker dedicated воркера
 */
function isUpdateNodeImage(value: any): value is TMessageUpdateNodeImageOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node image")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("newName" in value) || ("newName" in value && typeof value.newName !== "string")) return false;
    if (!("newSrc" in value) || ("newSrc" in value && typeof value.newSrc !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNodeTableOnWorker dedicated воркера
 */
function isUpdateNodeTable(value: any): value is TMessageUpdateNodeTableOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node table")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("newValue" in value) || ("newValue" in value && !isTableValue(value.newValue))) return false;
    return true;
}

export {
    isDataTreeNote,
    isDataTreeFolder,
    isDataNoteBody,
    isDataSave,
    isFunctionData,
    isDelByIdData,
    isDelCompInNote,
    isCloneFiltredTree,
    isUpdateNodeValue,
    isUpdNoteComponentsOrder,
    isUpdateNodeImage,
    isTableValue,
    isUpdateNodeTable,
};
export type { GetProps, Ref, RemoveReadonly };
