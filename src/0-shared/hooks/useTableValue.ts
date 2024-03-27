import React, { useState, useEffect, useRef } from "react";
import type { TTableValue } from "0-shared/types/dataSave";
import { useIndexedDBTablesUpdate } from "./useIndexedDBTableUpdate";
import { getTableDB } from "2-features/utils/appIndexedDB";

type TUseDataTreeParams = {
    componentTableID: string;
    onStartLoading?: () => void;
    onEndLoading?: () => void;
};

/**
 * вытаскивает данные для таблицы по ID из db. Специально для компонента NoteTable
 * @prop componentTableID - это id компонента noteTable, для него будем искать данные в indexedDB
 */
function useTableValue({ componentTableID, onStartLoading, onEndLoading }: TUseDataTreeParams) {
    const [tableValue, setTableValue] = useState<TTableValue | null>(null);

    const handlerFunc = () => {
        onStartLoading && onStartLoading();
        // запрашиваем данные из indexed db
        getTableDB({
            key: componentTableID,
            callback: (tableData) => {
                // если чтото вернулось
                if (tableData) {
                    setTableValue(tableData.value);
                } else {
                    setTableValue(null);
                }
                onEndLoading && onEndLoading();
            },
            onError: () => {
                onEndLoading && onEndLoading();
            },
        });
    };

    useIndexedDBTablesUpdate(handlerFunc);

    useEffect(handlerFunc, []);

    return tableValue;
}

export { useTableValue };
