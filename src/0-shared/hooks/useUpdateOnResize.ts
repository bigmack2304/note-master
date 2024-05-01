import React, { useEffect } from "react";
import { useHandleUpdate } from "0-shared/hooks/useHandleUpdate";

/**
 * вызывает перерендер компонента при ресайзе window
 * @param isLowUpdate - нужноли выполнять перерендер через декоратор пониженного абдейта
 */
function useUpdateOnResize(isLowUpdate: boolean) {
    const [handleUpdate] = useHandleUpdate(isLowUpdate);

    useEffect(() => {
        window.addEventListener("resize", handleUpdate);
        return () => {
            window.removeEventListener("resize", handleUpdate);
        };
    }, []);
}

export { useUpdateOnResize };
