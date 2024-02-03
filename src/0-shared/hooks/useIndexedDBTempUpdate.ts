import React, { useEffect } from "react";
import { useHandleUpdate } from "./useHandleUpdate";
import type { IDataSave } from "0-shared/types/dataSave";

function useIndexedDBTempDataUpdate(onUpdCallback?: () => void) {
    const [handleupdate] = useHandleUpdate();

    const onUpdate = () => {
        handleupdate();
        onUpdCallback && onUpdCallback();
    };

    useEffect(() => {
        window.addEventListener("appIndexedDBTempUpdate", onUpdate as EventListener);

        return () => {
            window.removeEventListener("appIndexedDBTempUpdate", onUpdate as EventListener);
        };
    }, []);
}

export { useIndexedDBTempDataUpdate };
