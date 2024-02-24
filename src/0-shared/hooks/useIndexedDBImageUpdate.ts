import React, { useEffect, useCallback } from "react";
import { useHandleUpdate } from "./useHandleUpdate";

/**
 * подписка на обновление data_images в indexed db
 * @param onUpdCallback вызовится когда произойдет изменение data_images во временных данных indexed db
 */
function useIndexedDBImagesUpdate(onUpdCallback?: () => void) {
    const [handleupdate] = useHandleUpdate();

    const onUpdate = useCallback(() => {
        handleupdate();
        onUpdCallback && onUpdCallback();
    }, []);

    useEffect(() => {
        window.addEventListener("appIndexedDBImagesUpdate", onUpdate as EventListener);

        return () => {
            window.removeEventListener("appIndexedDBImagesUpdate", onUpdate as EventListener);
        };
    }, []);
}

export { useIndexedDBImagesUpdate };
