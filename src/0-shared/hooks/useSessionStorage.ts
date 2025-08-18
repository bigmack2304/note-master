import React, { useEffect } from "react";
import { useHandleUpdate } from "./useHandleUpdate";
import { get_session_stprage_data, set_session_storage_data } from "0-shared/utils/appSessionStorage";
import { EV_NAME_UPD_SESSION_STORAGE } from "5-app/settings";
import type { IAppSessionStorage } from "0-shared/utils/appSessionStorage";

/**
 * хук для чтения и записи данных в session-сторадж, по томуже принцыпу что и useState
 *
 * @param updateOnChange нужноли вызывать перерендер при обновлении session Storage?
 * @returns
 */
function useSessionStorage(
    updateOnChange: boolean
): [sessionStorageData: IAppSessionStorage, setSessionStorageData: (data: IAppSessionStorage) => void] {
    const sessionData = get_session_stprage_data();
    const [handleupdate] = useHandleUpdate();

    const setSessionData = (data: IAppSessionStorage) => {
        set_session_storage_data(data);
    };

    useEffect(() => {
        if (updateOnChange) {
            window.addEventListener(EV_NAME_UPD_SESSION_STORAGE, handleupdate);
        }
        return () => {
            if (updateOnChange) {
                window.removeEventListener(EV_NAME_UPD_SESSION_STORAGE, handleupdate);
            }
        };
    }, []);

    return [sessionData, setSessionData];
}

export { useSessionStorage };
