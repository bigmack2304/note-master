import React, { useState, useCallback } from "react";
import { firstCallerDelayCallback } from "0-shared/utils/decorators";

/**
 * хук на случай если понадобится ручное обновление компонента, возвращает [функцию] при вызове которой произойдет перерендер.
 * @param isUseLowUpdate - boolean, будетли происходить ререндер через декоратор пониженного абдейта.
 */
function useHandleUpdate(isUseLowUpdate?: boolean): [handleUpdate: () => void] {
    let [HandleUpdateVal, setHandleUpdateVal] = useState<boolean>(true);

    const handleUpdate = useCallback(() => {
        setHandleUpdateVal((state) => !state);
    }, []);

    const handleUpdateLowUpdate = useCallback(
        firstCallerDelayCallback({
            func: () => {
                setHandleUpdateVal((state) => !state);
            },
        }),
        []
    );

    if (isUseLowUpdate) return [handleUpdateLowUpdate];
    return [handleUpdate];
}

export { useHandleUpdate };
