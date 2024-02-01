import React, { useState, useCallback } from "react";
import { firstCallerDelayCallback } from "0-shared/utils/decorators";

// хук на случай если понадобится ручное обновление компонента
// handleUpdate функция неизменна между рендерами
//
// если вызвать хук с параметром true то возвращенный [handleUpdate] будет обернут в декоратор
// для предотвращения вызовов с большой частотой

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
