import React, { useEffect, useCallback } from "react";
import { useHandleUpdate } from "./useHandleUpdate";

/**
 * подписка на обновление data_tables в indexed db
 * @param onUpdCallback вызовится когда произойдет изменение data_tables во временных данных indexed db
 */
function useIndexedDBTablesUpdate(onUpdCallback?: () => void) {
    const [handleupdate] = useHandleUpdate();

    const onUpdate = useCallback(() => {
        handleupdate();
        onUpdCallback && onUpdCallback();
    }, []);

    useEffect(() => {
        window.addEventListener("appIndexedDBTablesUpdate", onUpdate as EventListener);

        return () => {
            window.removeEventListener("appIndexedDBTablesUpdate", onUpdate as EventListener);
        };
    }, []);
}

export { useIndexedDBTablesUpdate };
