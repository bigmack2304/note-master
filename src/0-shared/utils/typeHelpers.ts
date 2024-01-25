// вычисляет пропсы компонента
type GetProps<T> = T extends React.ComponentType<infer Props> ? Props : unknown;

export type { GetProps };
