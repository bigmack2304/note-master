import React, { useState, useEffect } from "react";
import type { IAllTags } from "0-shared/types/dataSave";
import { getGlobalTagsDB } from "2-features/utils/appIndexedDBFynctions/globalTagsFunctions";
import { useIndexedDBTagsUpdate } from "./useIndexedDBTagsUpdate";

type TUseTagsParams = {
    onStartLoading?: () => void;
    onEndLoading?: () => void;
};

/**
 * возвращает global_tags из indexed db
 */
function useTags({ onStartLoading, onEndLoading }: TUseTagsParams = {}): IAllTags | undefined {
    const [allTagsValue, setAllTagsValue] = useState<IAllTags | undefined>(undefined);

    const handlerFunc = () => {
        onStartLoading && onStartLoading();
        getGlobalTagsDB({
            callback: (allTags) => {
                onEndLoading && onEndLoading();
                setAllTagsValue(allTags);
            },
            onError: () => {
                onEndLoading && onEndLoading();
            },
        });
    };

    useIndexedDBTagsUpdate(handlerFunc);

    useEffect(handlerFunc, []);

    return allTagsValue;
}

export { useTags };
