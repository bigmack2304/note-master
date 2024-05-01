import React, { useEffect } from "react";
import { useHandleUpdate } from "./useHandleUpdate";
import type { IAppLocalStorage } from "2-features/utils/appLoacalStorage";
import { get_stprage_data, set_storage_data } from "2-features/utils/appLoacalStorage";

/**
 * хук для чтения и записи данных в локал-сторадж, по томуже принцыпу что и useState
 *
 * @param updateOnChange нужноли вызывать перерендер при обновлении Loacal Storage?
 * @returns
 */
function useLoacalStorage(updateOnChange: boolean): [localStorageData: IAppLocalStorage, setLocalStorageData: (data: IAppLocalStorage) => void] {
    const localData = get_stprage_data();
    const [handleupdate] = useHandleUpdate();

    const setLocalData = (data: IAppLocalStorage) => {
        set_storage_data(data);
    };

    useEffect(() => {
        if (updateOnChange) {
            window.addEventListener("appLocalStorageUpdate", handleupdate);
        }
        return () => {
            if (updateOnChange) {
                window.removeEventListener("appLocalStorageUpdate", handleupdate);
            }
        };
    }, []);

    return [localData, setLocalData];
}

export { useLoacalStorage };
