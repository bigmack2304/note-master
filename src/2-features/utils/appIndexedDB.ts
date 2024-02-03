// работа с indexed DB через idb
// в indexed DB будем сохранять текущий фаил сохранения с которым работаем.
// кроме этого там будем держать и temp фаил сохранения, который при выходе удалится. (чтобы не держать его в оперативе) (возможно потом както это обыграем)

import { openDB, DBSchema } from "idb";
import type { IDataSave, IDataTreeFolder, IGlobalTag } from "0-shared/types/dataSave";

const DB_NAME = "app_note_master_db_data";
const DB_VERSION = 1;

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

type getTempDataDBParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IDataSave | undefined) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    // key: MyDB["tempData"]["key"];
};

const TEMP_DATA_KEY = "0";

async function getTempDataDB({ onComplete = () => {}, onError = () => {}, callback = () => {} }: getTempDataDBParams = {}) {
    const db = await openIndexedDB();
    const tx = db.transaction("tempData", "readonly");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    const data = tx.store;
    let value = await data.get(TEMP_DATA_KEY);
    callback(value);
    await tx.done;
}

type setTempDataDBParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IDataSave | undefined) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    value: IDataSave;
    // key: MyDB["tempData"]["key"];
};

async function setTempDataDB({ onComplete = () => {}, onError = () => {}, callback = () => {}, value }: setTempDataDBParams) {
    const db = await openIndexedDB();
    const tx = db.transaction("tempData", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    const data = tx.store;
    data.put(value, TEMP_DATA_KEY);
    callback(value);
    dispatchEventIndexedDBTempUpdate(value);
    await tx.done;
}

type delTempDataDBParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
};

async function delTempDataDB({ onComplete = () => {}, onError = () => {} }: delTempDataDBParams = {}) {
    const db = await openIndexedDB();
    const tx = db.transaction("tempData", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    const data = tx.store;
    data.delete(TEMP_DATA_KEY);
    await tx.done;
}

// генерирует событие при вызове set_storage_data
function dispatchEventIndexedDBTempUpdate(value: IDataSave) {
    window.dispatchEvent(new CustomEvent("appIndexedDBTempUpdate", { detail: value }));
}

// удаляем временные данные из DB
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

export { getTempDataDB, setTempDataDB, delTempDataDB };
