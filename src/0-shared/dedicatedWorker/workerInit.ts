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
 * снятие воркера
 */
function workerUnregister() {
    if (workerRef.DWorker !== null) {
        workerRef.DWorker.terminate();
        setWorkerRef(null);
        console.log("DW unregistered: ", workerRef.DWorker);
    }
}

export { workerRegister, workerUnregister, workerRef };
