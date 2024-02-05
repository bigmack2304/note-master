import { ForwardRefRenderFunction } from "react";
import type { IDataTreeNote, IDataTreeFolder, TNoteBody, TchildrenType } from "0-shared/types/dataSave";

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
function isDataTreeNote(node: TchildrenType | TNoteBody): node is IDataTreeNote {
    return node.type === "note";
}

/**
 * проверяет чтобы сущьность пренадлежала к типу IDataTreeFolder
 * @param node
 * @returns boolean
 */
function isDataTreeFolder(node: TchildrenType | TNoteBody): node is IDataTreeFolder {
    return node.type === "folder";
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TNoteBody
 * @param node
 * @returns boolean
 */
function isDataNoteBody(node: TchildrenType | TNoteBody): node is TNoteBody {
    return node.type === "component";
}

export { isDataTreeNote, isDataTreeFolder, isDataNoteBody };
export type { GetProps, Ref };
