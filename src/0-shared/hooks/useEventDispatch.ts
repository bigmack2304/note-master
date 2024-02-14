import React, { useEffect, useCallback } from "react";
import { useHandleUpdate } from "./useHandleUpdate";

type TuseEventDispatchProps = {
    eventName?: string;
};

/**
 * позволяет вызвать любое событие
 * @prop eventName - (default: undefuned) имя события которое нужно вызвать
 */
function useEventDispatch({ eventName }: TuseEventDispatchProps = {}): [dispatchEvent: () => void] {
    const dispatchEvent = useCallback(() => {
        if (eventName) {
            window.dispatchEvent(new CustomEvent(eventName));
        }
    }, []);

    return [dispatchEvent];
}

export { useEventDispatch };
