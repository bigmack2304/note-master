import React, { useEffect } from "react";
import { useHandleUpdate } from "./useHandleUpdate";
import { get_stprage_data, set_storage_data } from "2-features/utils/appLocalStorage";
import { EV_NAME_UPD_LOCAL_STORAGE } from "5-app/settings";
import type { IAppLocalStorage } from "2-features/utils/appLocalStorage";

/**
 * хук для чтения и записи данных в локал-сторадж, по томуже принцыпу что и useState
 *
 * @param updateOnChange нужноли вызывать перерендер при обновлении Loacal Storage?
 * @returns
 */
function useLocalStorage(
    updateOnChange: boolean
): [localStorageData: IAppLocalStorage, setLocalStorageData: (data: IAppLocalStorage) => void] {
    const localData = get_stprage_data();
    const [handleupdate] = useHandleUpdate();

    const setLocalData = (data: IAppLocalStorage) => {
        set_storage_data(data);
    };

    useEffect(() => {
        if (updateOnChange) {
            window.addEventListener(EV_NAME_UPD_LOCAL_STORAGE, handleupdate);
        }
        return () => {
            if (updateOnChange) {
                window.removeEventListener(EV_NAME_UPD_LOCAL_STORAGE, handleupdate);
            }
        };
    }, []);

    return [localData, setLocalData];
}

export { useLocalStorage };
