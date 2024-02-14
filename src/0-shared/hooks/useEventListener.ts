import React, { useEffect, useCallback } from "react";
import { useHandleUpdate } from "./useHandleUpdate";

type TuseEventListenerProps = {
    updateOnReset?: boolean;
    eventName?: string | string[];
    onEvent?: () => void;
};

/**
 * позволяет подписатся на любое событие и выполнить какието действия при его появлении
 * @prop updateOnReset - (default: false) нужноли выполнить перерендер компонента
 * @prop onEvent - (default: undefuned) колбек который отработает после появления события
 * @prop eventName - (default: undefuned) имя события на которое подписываемся
 */
function useEventListener({ updateOnReset, onEvent, eventName }: TuseEventListenerProps) {
    const [handleupdate] = useHandleUpdate();

    const onEvt = useCallback(() => {
        onEvent && onEvent();

        if (updateOnReset) {
            handleupdate();
        }
    }, []);

    useEffect(() => {
        if (eventName) {
            if (Array.isArray(eventName)) {
                for (let nameItem of eventName) {
                    window.addEventListener(nameItem, onEvt);
                }
            } else {
                window.addEventListener(eventName, onEvt);
            }
        }

        return () => {
            if (eventName) {
                if (Array.isArray(eventName)) {
                    for (let nameItem of eventName) {
                        window.removeEventListener(nameItem, onEvt);
                    }
                } else {
                    window.removeEventListener(eventName, onEvt);
                }
            }
        };
    }, []);
}

export { useEventListener };
