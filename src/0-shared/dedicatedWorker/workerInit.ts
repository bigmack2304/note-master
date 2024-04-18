import {
    dispatchEventIndexedDBImagesUpdate,
    dispatchEventIndexedDBTableUpdate,
    dispatchEventIndexedDBTagsUpdate,
    dispatchEventIndexedDBTreeUpdate,
} from "2-features/utils/appIndexedDBFynctions/appIndexedDBEvents";
import type { RemoveReadonly } from "0-shared/utils/typeHelpers";

// скрипт создает dedicated Worker, workerRegister должен выполнятся 1 раз при загрузке страницы

type TRefWorker = {
    readonly DWorker: Worker | null;
};

/**
 *  обьект для хранения ссылки на dedicated воркера
 */
const workerRef: TRefWorker = {
    DWorker: null,
};

/**
 * устанавлевает новое значение для workekrRef.DWorker
 */
function setWorkerRef(newValue: TRefWorker["DWorker"]) {
    (workerRef as RemoveReadonly<TRefWorker>).DWorker = newValue;
}

/**
 * создает и регистрирует dedicated воркера
 * @param autoUnregister если true то автоматически  удаляет воркера при  закрытии странцы
 */
function workerRegister(autoUnregister: boolean = false) {
    if (workerRef.DWorker !== null) return;
    window.addEventListener("load", () => {
        try {
            setWorkerRef(
                new Worker(new URL("./dedicatedWorker.ts", import.meta.url), {
                    name: "Dedicated Worker",
                })
            );
            rgisterWorkerMessages();
            console.log("DW registered: ", workerRef.DWorker);
        } catch (e) {
            console.log("DW registration failed: ", e);
        }
    });

    if (autoUnregister) {
        window.addEventListener(
            "beforeunload",
            (e) => {
                workerUnregister();
            },
            { once: true }
        );
    }
}

/**
 *  вешаем на воркер дефолтный обработчик сообщений
 */
function rgisterWorkerMessages() {
    if (!workerRef.DWorker) throw new Error("DWorker not found");
    workerRef.DWorker.addEventListener("message", onWorkerMessage);
}

/**
 * тут будем обрабатывать сообщения от воркера которые могут быть не связаны на прямую с выполнением какой либо задачи.
 */
function onWorkerMessage(e: MessageEvent) {
    // воркер может менять indexeddb, если такое произойдет мы должны отреагировать на это в этом потоке
    if (e.data === "worker generate event: appIndexedDBTagsUpdate") {
        dispatchEventIndexedDBTagsUpdate();
    }
    if (e.data === "worker generate event: appIndexedDBTreeUpdate") {
        dispatchEventIndexedDBTreeUpdate();
    }
    if (e.data === "worker generate event: appIndexedDBImagesUpdate") {
        dispatchEventIndexedDBImagesUpdate();
    }
    if (e.data === "worker generate event: appIndexedDBTablesUpdate") {
        dispatchEventIndexedDBTableUpdate();
    }
}

/**
 * снятие воркера
 */
function workerUnregister() {
    if (workerRef.DWorker !== null) {
        workerRef.DWorker.removeEventListener("message", onWorkerMessage);
        workerRef.DWorker.terminate();
        setWorkerRef(null);
        console.log("DW unregistered: ", workerRef.DWorker);
    }
}

export { workerRegister, workerUnregister, workerRef };
