import React, { useState, useEffect } from "react";
import type { IAllTags } from "0-shared/types/dataSave";
import { getGlobalTagsDB } from "2-features/utils/appIndexedDB";
import { useIndexedDBTempDataUpdate } from "./useIndexedDBTempUpdate";

/**
 * возвращает global_tags из indexed db
 */
function useTags(): IAllTags | undefined {
    const [allTagsValue, setAllTagsValue] = useState<IAllTags | undefined>(undefined);

    useIndexedDBTempDataUpdate(() => {
        getGlobalTagsDB({
            callback: (allTags) => {
                setAllTagsValue(allTags);
            },
        });
    });

    useEffect(() => {
        getGlobalTagsDB({
            callback: (allTags) => {
                setAllTagsValue(allTags);
            },
        });
    }, []);

    return allTagsValue;
}

export { useTags };
