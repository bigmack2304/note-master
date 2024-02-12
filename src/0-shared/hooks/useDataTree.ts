import React, { useState, useEffect } from "react";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";
import { getDataTreeDB } from "2-features/utils/appIndexedDB";
import { useIndexedDBTreeUpdate } from "./useIndexedDBTreeUpdate";

/**
 * возвращает data_tree из indexed db
 */
function useDataTree(): IDataTreeRootFolder | undefined {
    const [dataTreeValue, setDataTreeValue] = useState<IDataTreeRootFolder | undefined>(undefined);

    useIndexedDBTreeUpdate(() => {
        getDataTreeDB({
            callback: (dataTree) => {
                setDataTreeValue(dataTree);
            },
        });
    });

    useEffect(() => {
        getDataTreeDB({
            callback: (dataTree) => {
                setDataTreeValue(dataTree);
            },
        });
    }, []);

    return dataTreeValue;
}

export { useDataTree };
