import React from "react";
import { enqueueSnackbar } from "notistack";
import { useEventListener } from "./useEventListener";
import { EV_NAME_SAVE_DATA_REDUCER_FULFILLED, EV_NAME_SAVE_DATA_REDUCER_REJECT } from "5-app/settings";

/**
 *  отвечает за пополнение стека enqueueSnackbar, который в свою очередь используется для показа уведомлений в приложении.
 *  @ реагирует на кастомные события в асинхронных редьюсерах и показывает уведомления.
 */
function useAppUiInfo() {
    useEventListener({
        eventName: EV_NAME_SAVE_DATA_REDUCER_FULFILLED,
        onEvent(e) {
            enqueueSnackbar("Выполнено", { variant: "success" });
        },
    });

    useEventListener({
        eventName: EV_NAME_SAVE_DATA_REDUCER_REJECT,
        onEvent(e) {
            enqueueSnackbar("Ошибка", { variant: "error" });
        },
    });
}

export { useAppUiInfo };
