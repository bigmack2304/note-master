import { ForwardRefRenderFunction } from "react";

// вычисляет пропсы компонента
type GetProps<T> = T extends React.ComponentType<infer Props> ? Props : unknown;

// типизирует параметр ref в компоненте, если используется forwardRef
// в качестве T применяется тип элемента на который перенаправляется ref (например HTMLInputElement)
type Ref<T> = Parameters<ForwardRefRenderFunction<T>>[1];

export type { GetProps, Ref };
