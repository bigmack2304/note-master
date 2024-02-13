import React, { useEffect, useCallback } from "react";
import { useHandleUpdate } from "./useHandleUpdate";
import type { IDataSave } from "0-shared/types/dataSave";

/**
 * подписка на обновление data_tree в indexed db
 * @param onUpdCallback вызовится когда произойдет изменение tempData в indexed db
 */
function useIndexedDBTreeUpdate(onUpdCallback?: () => void) {
    const [handleupdate] = useHandleUpdate();

    const onUpdate = useCallback(() => {
        handleupdate();
        onUpdCallback && onUpdCallback();
    }, []);

    useEffect(() => {
        window.addEventListener("appIndexedDBTreeUpdate", onUpdate as EventListener);

        return () => {
            window.removeEventListener("appIndexedDBTreeUpdate", onUpdate as EventListener);
        };
    }, []);
}

export { useIndexedDBTreeUpdate };
