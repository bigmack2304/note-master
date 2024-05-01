import React from "react";
import { enqueueSnackbar } from "notistack";
import { useEventListener } from "./useEventListener";
import {
    EV_NAME_SAVE_DATA_REDUCER_FULFILLED,
    EV_NAME_SAVE_DATA_REDUCER_REJECT,
    EV_NAME_SAVE_DATA_REDUCER_SAVE_FULFILLED,
    EV_NAME_SAVE_DATA_REDUCER_LOAD_FULFILLED,
    EV_NAME_TABLE_SAVE,
} from "5-app/settings";

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

    useEventListener({
        eventName: EV_NAME_SAVE_DATA_REDUCER_SAVE_FULFILLED,
        onEvent(e) {
            enqueueSnackbar("Сохранено", { variant: "success" });
        },
    });

    useEventListener({
        eventName: EV_NAME_SAVE_DATA_REDUCER_LOAD_FULFILLED,
        onEvent(e) {
            enqueueSnackbar("Загружено", { variant: "success" });
        },
    });

    useEventListener({
        eventName: EV_NAME_TABLE_SAVE,
        onEvent(e) {
            enqueueSnackbar("Таблица сохранена", { variant: "success" });
        },
    });
}

export { useAppUiInfo };
