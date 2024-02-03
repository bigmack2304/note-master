import React, { useEffect, useCallback } from "react";

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
