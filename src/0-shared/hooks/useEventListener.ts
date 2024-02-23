import React, { useEffect, useCallback } from "react";
import { useHandleUpdate } from "./useHandleUpdate";

type TuseEventListenerProps<E extends Event> = {
    updateOnReset?: boolean;
    eventName?: string | string[];
    eventTarget?: Window | Document | HTMLElement;
    onEvent?: (e: E) => void;
};

/**
 * позволяет подписатся на любое событие и выполнить какието действия при его появлении
 * @ не требует мемоизирования входящих параметров, не требоует следнить за отпиской
 *
 * @prop updateOnReset - (default: false) нужноли выполнить перерендер компонента
 * @prop onEvent - (default: undefuned) колбек который отработает после появления события
 * @prop eventName - (default: undefuned) имя события на которое подписываемся
 * @prop eventTarget - (default: window) обьект на котором прослушиваем событие,
 */
function useEventListener<E extends Event>({ updateOnReset, onEvent, eventName, eventTarget = window }: TuseEventListenerProps<E>) {
    const [handleupdate] = useHandleUpdate();

    const onEvt = useCallback((e: E) => {
        onEvent && onEvent(e);

        if (updateOnReset) {
            handleupdate();
        }
    }, []) as EventListener;

    useEffect(() => {
        if (eventName) {
            if (Array.isArray(eventName)) {
                for (let nameItem of eventName) {
                    eventTarget.addEventListener(nameItem, onEvt);
                }
            } else {
                eventTarget.addEventListener(eventName, onEvt);
            }
        }

        return () => {
            if (eventName) {
                if (Array.isArray(eventName)) {
                    for (let nameItem of eventName) {
                        eventTarget.removeEventListener(nameItem, onEvt);
                    }
                } else {
                    eventTarget.removeEventListener(eventName, onEvt);
                }
            }
        };
    }, []);
}

export { useEventListener };
