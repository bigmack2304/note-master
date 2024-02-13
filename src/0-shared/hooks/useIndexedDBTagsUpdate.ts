import React, { useEffect, useCallback } from "react";
import { useHandleUpdate } from "./useHandleUpdate";

/**
 * подписка на обновление allTags в indexed db
 * @param onUpdCallback вызовится когда произойдет изменение tempData в indexed db
 */
function useIndexedDBTagsUpdate(onUpdCallback?: () => void) {
    const [handleupdate] = useHandleUpdate();

    const onUpdate = useCallback(() => {
        handleupdate();
        onUpdCallback && onUpdCallback();
    }, []);

    useEffect(() => {
        window.addEventListener("appIndexedDBTagsUpdate", onUpdate as EventListener);

        return () => {
            window.removeEventListener("appIndexedDBTagsUpdate", onUpdate as EventListener);
        };
    }, []);
}

export { useIndexedDBTagsUpdate };
