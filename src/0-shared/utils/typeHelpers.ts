import { ForwardRefRenderFunction } from "react";
import type { IDataTreeNote, IDataTreeFolder, TNoteBody } from "0-shared/types/dataSave";

// вычисляет пропсы компонента
type GetProps<T> = T extends React.ComponentType<infer Props> ? Props : unknown;

// типизирует параметр ref в компоненте, если используется forwardRef
// в качестве T применяется тип элемента на который перенаправляется ref (например HTMLInputElement)
type Ref<T> = Parameters<ForwardRefRenderFunction<T>>[1];

// проверяет чтобы сущьность пренадлежала к типу IDataTreeNote
function isDataTreeNote(val: any): val is IDataTreeNote {
    return val.type === "note";
}

// проверяет чтобы сущьность пренадлежала к типу IDataTreeFolder
function isDataTreeFolder(val: any): val is IDataTreeFolder {
    return val.type === "folder";
}

// проверяет чтобы сущьность пренадлежала к типу TNoteBody
function isDataNoteBody(val: any): val is TNoteBody {
    return val.type === "component";
}

export { isDataTreeNote, isDataTreeFolder, isDataNoteBody };
export type { GetProps, Ref };
