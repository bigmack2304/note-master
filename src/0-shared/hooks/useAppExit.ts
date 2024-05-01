import React, { useEffect, useCallback } from "react";

/**
 * хук позволяет определить функцию которая вызовится при закрытии страницы
 * @param onExitCallback(e: BeforeUnloadEvent) - вызывается в момент звкрытия страницы
 */
function useAppExit(onExitCallback?: (e: BeforeUnloadEvent) => void) {
    const onExit = useCallback((e: BeforeUnloadEvent) => {
        onExitCallback && onExitCallback(e);
    }, []);

    useEffect(() => {
        window.addEventListener("beforeunload", onExit);
        return () => {
            window.removeEventListener("beforeunload", onExit);
        };
    }, []);
}

export { useAppExit };
