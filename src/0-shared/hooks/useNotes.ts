import React, { useState, useEffect } from "react";
import { getAllNotes } from "2-features/utils/saveDataParse";
import { getDataTreeDB } from "2-features/utils/appIndexedDBFynctions/dataTreeDb";
import { useIndexedDBTreeUpdate } from "./useIndexedDBTreeUpdate";
import type { IDataTreeNote } from "0-shared/types/dataSave";

type TuseNotesParams = {
    onStartLoading?: () => void;
    onEndLoading?: () => void;
};

/**
 * возвращает массив всех заметок из indexed db
 */
function useNotes({ onStartLoading, onEndLoading }: TuseNotesParams = {}): IDataTreeNote[] {
    const [allNotesValue, setAllNotesValue] = useState<IDataTreeNote[]>([]);

    const handlerFunc = () => {
        onStartLoading && onStartLoading();
        getDataTreeDB({
            callback: (value) => {
                if (value) {
                    onEndLoading && onEndLoading();
                    setAllNotesValue(getAllNotes(value));
                }
            },
            onError: () => {
                onEndLoading && onEndLoading();
            },
        });
    };

    useIndexedDBTreeUpdate(handlerFunc);

    useEffect(handlerFunc, []);

    return allNotesValue;
}

export { useNotes };
