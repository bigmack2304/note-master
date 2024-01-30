import React, { useState, useCallback } from "react";

// хук на случай если понадобится ручное обновление компонента
// handleUpdate функция неизменна между рендерами

function useHandleUpdate(): [handleupdate: () => void] {
    let [HandleUpdateVal, setHandleUpdateVal] = useState<boolean>(true);

    const handleUpdate = useCallback(() => {
        setHandleUpdateVal((state) => !state);
    }, []);

    return [handleUpdate];
}

export { useHandleUpdate };
