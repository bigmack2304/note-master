type TAnyFunc = (...args: any[]) => any;

interface ICallStackElement {
    argum: any[];
}

type TDecoratorParametres<T> = {
    func: T;
    callback?: () => void;
    delay?: number;
};

/**
 * Декоратор. Накапливает вызовы функции, вызывает func асинхронно по интервалу delay, пока стек всех вызовов не будет пуст,
 * при вызове функции во время отчета delay, delay не сбрасывается, а параметры вызова помещаются в стек.
 * @prop func - функция которую нужно обернуть
 * @prop callback - вызывается после выполнения всего стека вызовов
 * @prop delay - задержка перед выполнениями
 */
function callerDelayCallback<T extends TAnyFunc>({ func, callback = () => {}, delay = 100 }: TDecoratorParametres<T>) {
    let call_stack: ICallStackElement[] = [];
    let is_start: boolean = false;

    return function caller(...args: Parameters<T>): void {
        call_stack.push({ argum: args });

        const func_call = () => {
            if (call_stack.length >= 1) {
                let { argum } = call_stack.shift() as ICallStackElement; // трудоемкая процедура
                func(...argum);
                setTimeout(func_call, delay);
            } else {
                is_start = false;
                callback();
            }
        };

        if (!is_start) {
            is_start = true; // выставляем флаг работы
            setTimeout(func_call, delay);
        }
    };
}

/**
 * Декоратор. При вызове обернутой функции, запоминает параметры вызова и начинает отчет delay, по истечению отчета происходит фызов func с последними параметрами.
 * При повторном вызове обернутой функции (во время отчета), происходит обновление полученных параметров и сброс delay, отчет начинается заново.
 *
 * @prop func - функция которую нужно обернуть
 * @prop callback - вызывается после выполнения оборачиваемой функции
 * @prop delay - задержка перед выполнениями
 */
function firstCallerDelayCallback<T extends TAnyFunc>({ func, callback = () => {}, delay = 100 }: TDecoratorParametres<T>) {
    let call_stack: ICallStackElement;
    let is_start: boolean = false;
    let timer_id: any = 0;

    return function caller(...args: Parameters<T>): void {
        call_stack = { argum: args };

        const func_call = () => {
            let { argum } = call_stack as ICallStackElement; // трудоемкая процедура
            func(...argum);
            is_start = false;
            callback();
        };

        if (is_start) {
            clearTimeout(timer_id);
        }

        is_start = true; // выставляем флаг работы
        timer_id = setTimeout(func_call, delay);
    };
}

/**
 * Декоратор. При вызове обернутой функции, происходит запоминание параметров и начинается отчет delay, после чего func вызывается.
 * Если повторно вызвать обернутую функцию во время отчета то обновляются параметры для вызова на новые полученные, при этом сброс delay не происходит.
 *
 * @prop func - функция которую нужно обернуть
 * @prop callback - вызывается после выполнения оборачиваемой функции
 * @prop delay - задержка перед выполнениями
 */
function lowUpdateDecorator<T extends TAnyFunc>({ func, callback = () => {}, delay = 100 }: TDecoratorParametres<T>) {
    let call_stack: ICallStackElement;
    let is_start: boolean = false;

    return function caller(...args: Parameters<T>): void {
        call_stack = { argum: args };

        if (is_start) {
            return;
        }

        const func_call = () => {
            let { argum } = call_stack as ICallStackElement; // трудоемкая процедура
            func(...argum);
            is_start = false;
            callback();
        };

        is_start = true; // выставляем флаг работы
        setTimeout(func_call, delay);
    };
}

/**
 * Декоратор. Позволяет кешировать возвращенные значения от func, при повторном вызове с параметрами которые уже были в кеше
 * возвращает значение из кеша.
 *
 * @prop func - функция которую нужно обернуть
 */
function cacheDecorator<T extends TAnyFunc, R extends ReturnType<T>>(func: T) {
    const ERR_RESPONSE = "!! decorators.is_cached: value not cached !!";
    const cache_v2 = new Map<string, R>();

    const get_cached = (args: Parameters<T>): typeof ERR_RESPONSE | R => {
        try {
            const calcKey = JSON.stringify(args);

            if (cache_v2.has(calcKey)) {
                return cache_v2.get(calcKey) as R;
            }
        } catch {
            // Если данные не сирализуемы
            return ERR_RESPONSE;
        }

        return ERR_RESPONSE;
    };

    return (...args: Parameters<T>) => {
        let result: R;
        let is_value_cache = get_cached(args);

        if (is_value_cache === ERR_RESPONSE) {
            result = func(...args);
            cache_v2.set(JSON.stringify(args), result);
        } else {
            result = is_value_cache;
        }

        return result;
    };
}

export { callerDelayCallback, firstCallerDelayCallback, lowUpdateDecorator, cacheDecorator };
