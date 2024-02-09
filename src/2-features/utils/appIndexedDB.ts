// работа с indexed DB через idb
// в indexed DB будем сохранять текущий фаил сохранения с которым работаем.
// кроме этого там будем держать и temp фаил сохранения, который при выходе удалится. (чтобы не держать его в оперативе) (возможно потом както это обыграем)

import { openDB, DBSchema, deleteDB } from "idb";
import type { IDataSave, IDataTreeRootFolder, IAllTags } from "0-shared/types/dataSave";

const DB_NAME = "app_note_master_db_data";
const DB_VERSION = 1;
const TEMP_DATA_KEY = "0";

const tempStoreData = ["tempData", "db_type", "data_tree", "global_tags"] as const; //TODO: потом удалим "tempData"

interface MyDB extends DBSchema {
    savedData: {
        key: string;
        value: IDataSave;
    };
    //TODO: потом это удалим
    tempData: {
        key: string;
        value: IDataSave;
    };
    ///////////////////////////////////////////
    db_type: {
        key: string;
        value: string;
    };
    data_tree: {
        key: string;
        value: IDataTreeRootFolder;
    };
    global_tags: {
        key: string;
        value: IAllTags;
    };
}
//TODO: потом это удалим
type TGetTempDataDBParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IDataSave | undefined) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
};
//TODO: потом переименуем TSetAllTempDataDBParams
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

type TSetDataTreeDBParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IDataTreeRootFolder) => void;
    value: IDataTreeRootFolder;
};

type TSetGlobalTagsParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IAllTags) => void;
    value: IAllTags;
};

type TSetDbTypeParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: string) => void;
    value: string;
};

function def_onError(e: Event) {
    console.warn(e);
}

function def_onComplete(e: Event) {
    console.log(e);
}

/**
 * async функция, возвращает обьект indexed db
 * @returns
 */
async function openIndexedDB() {
    const db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            const savedDataDB = db.createObjectStore("savedData");
            const tempDataDB = db.createObjectStore("tempData"); //TODO: потом это удалим
            ////////////////////////////////
            const other = db.createObjectStore("db_type");
            const data_tree = db.createObjectStore("data_tree");
            const global_tags = db.createObjectStore("global_tags");
        },
        blocked(currentVersion, blockedVersion, event) {},
        blocking(currentVersion, blockedVersion, event) {},
        terminated() {},
    });

    return db;
}

//TODO: потом это удалим
/**
 * возвращает обьект TempData из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(IDataSave | undefined): вызывается после поиска
 * @returns Promise<IDataSave | undefined>
 */
async function getTempDataDB({ onComplete = def_onComplete, onError = def_onError, callback }: TGetTempDataDBParams = {}) {
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

//TODO: потом это удалим
/**
 * Записывает новое значение вместо обьекта TempData в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setTempDataDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetTempDataDBParams) {
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

async function setDbTypeDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetDbTypeParams) {
    const db = await openIndexedDB();
    const tx = db.transaction("db_type", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    tx.store.put(value, TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBTempUpdate();
    return value;
}

async function setDataTreeDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetDataTreeDBParams) {
    const db = await openIndexedDB();
    const tx = db.transaction("data_tree", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    tx.store.put(value, TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBTempUpdate();
    return value;
}

async function setGlobalTagsDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetGlobalTagsParams) {
    const db = await openIndexedDB();
    const tx = db.transaction("global_tags", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    tx.store.put(value, TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBTempUpdate();
    return value;
}

/**
 * Записывает загржунный фаил IDataSave в indexed db, распределяяя его по блокам
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setAllTempDataDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetTempDataDBParams) {
    const db = await openIndexedDB();
    const tx = db.transaction(tempStoreData, "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;

    tx.objectStore("data_tree").put(value.data_tree, TEMP_DATA_KEY);
    tx.objectStore("global_tags").put(value.global_tags, TEMP_DATA_KEY);
    tx.objectStore("db_type").put(value.db_type, TEMP_DATA_KEY);
    tx.objectStore("tempData").put(value, TEMP_DATA_KEY); //TODO: потом это удалим

    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBTempUpdate();
    return value;
}

/**
 * удаляет временные данные из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(): вызывается после применения изменений
 */
async function delTempDataDB({ onComplete = def_onComplete, onError = def_onError, callback }: TDelTempDataDBParams = {}) {
    const db = await openIndexedDB();
    const tx = db.transaction(tempStoreData, "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;

    for (let storeName of tempStoreData) {
        tx.objectStore(storeName).delete(TEMP_DATA_KEY);
    }

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

export { getTempDataDB, setTempDataDB, delTempDataDB, setAllTempDataDB };
