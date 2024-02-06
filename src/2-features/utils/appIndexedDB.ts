// работа с indexed DB через idb
// в indexed DB будем сохранять текущий фаил сохранения с которым работаем.
// кроме этого там будем держать и temp фаил сохранения, который при выходе удалится. (чтобы не держать его в оперативе) (возможно потом както это обыграем)

import { openDB, DBSchema } from "idb";
import type { IDataSave, IDataTreeFolder, IGlobalTag } from "0-shared/types/dataSave";

const DB_NAME = "app_note_master_db_data";
const DB_VERSION = 1;
const TEMP_DATA_KEY = "0";

interface MyDB extends DBSchema {
    savedData: {
        key: string;
        value: IDataSave;
    };
    tempData: {
        key: string;
        value: IDataSave;
    };
}

type TGetTempDataDBParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IDataSave | undefined) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
};

type TSetTempDataDBParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IDataSave | undefined) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    value: IDataSave;
};

type TDelTempDataDBParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: () => void;
};

/**
 * async функция, возвращает обьект indexed db
 * @returns
 */
async function openIndexedDB() {
    const db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            const savedDataDB = db.createObjectStore("savedData");
            const tempDataDB = db.createObjectStore("tempData");
        },
        blocked(currentVersion, blockedVersion, event) {},
        blocking(currentVersion, blockedVersion, event) {},
        terminated() {},
    });

    return db;
}

/**
 * возвращает обьект TempData из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(IDataSave | undefined): вызывается после поиска
 * @returns Promise<IDataSave | undefined>
 */
async function getTempDataDB({ onComplete = () => {}, onError = () => {}, callback }: TGetTempDataDBParams = {}) {
    const db = await openIndexedDB();
    const tx = db.transaction("tempData", "readonly");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    const data = tx.store;
    let value = await data.get(TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    return value;
}

/**
 * Записывает новое значение вместо обьекта TempData в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setTempDataDB({ onComplete = () => {}, onError = () => {}, callback, value }: TSetTempDataDBParams) {
    const db = await openIndexedDB();
    const tx = db.transaction("tempData", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    const data = tx.store;
    data.put(value, TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBTempUpdate();
    return value;
}

/**
 * удаляет TempData из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(): вызывается после применения изменений
 */
async function delTempDataDB({ onComplete = () => {}, onError = () => {}, callback }: TDelTempDataDBParams = {}) {
    const db = await openIndexedDB();
    const tx = db.transaction("tempData", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    const data = tx.store;
    data.delete(TEMP_DATA_KEY);
    await tx.done;
    callback && callback();
    return true;
}

/**
 * генерирует событие при вызове set_storage_data
 */
function dispatchEventIndexedDBTempUpdate() {
    window.dispatchEvent(new CustomEvent("appIndexedDBTempUpdate"));
}

/**
 * удаляем временные данные (TempData) из DB при закрытии приложения
 */
function removeTempDataOnExit() {
    window.addEventListener(
        "beforeunload",
        (e) => {
            delTempDataDB();
        },
        { once: true }
    );

    window.addEventListener(
        "DOMContentLoaded",
        (e) => {
            delTempDataDB();
        },
        { once: true }
    );
}

removeTempDataOnExit();

export { getTempDataDB, setTempDataDB, delTempDataDB };
