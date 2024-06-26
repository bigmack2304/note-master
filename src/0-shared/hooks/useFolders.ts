import React, { useState, useEffect } from "react";
import { getAllFolders } from "2-features/utils/saveDataParse";
import { getDataTreeDB } from "2-features/utils/appIndexedDBFynctions/dataTreeDb";
import { useIndexedDBTreeUpdate } from "./useIndexedDBTreeUpdate";
import type { IDataTreeFolder } from "0-shared/types/dataSave";

type TuseFoldersParams = {
    onStartLoading?: () => void;
    onEndLoading?: () => void;
};

/**
 * возвращает массив всех папок из indexed db
 * @PS: папки будут без поля children
 */
function useFolders({ onStartLoading, onEndLoading }: TuseFoldersParams = {}): IDataTreeFolder[] {
    const [allFoldersValue, setAllFoldersValue] = useState<IDataTreeFolder[]>([]);

    const handlerFunc = () => {
        onStartLoading && onStartLoading();
        getDataTreeDB({
            callback: (value) => {
                if (value) {
                    onEndLoading && onEndLoading();
                    setAllFoldersValue(getAllFolders(value));
                }
            },
            onError: () => {
                onEndLoading && onEndLoading();
            },
        });
    };

    useIndexedDBTreeUpdate(handlerFunc);

    useEffect(handlerFunc, []);

    return allFoldersValue;
}

export { useFolders };
