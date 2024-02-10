// работа с indexed DB через idb
// в indexed DB будем сохранять текущий фаил сохранения с которым работаем.
// кроме этого там будем держать и temp фаил сохранения, который при выходе удалится. (чтобы не держать его в оперативе) (возможно потом както это обыграем)

import { openDB, DBSchema, deleteDB } from "idb";
import type { IDataSave, IDataTreeRootFolder, IAllTags } from "0-shared/types/dataSave";

const DB_NAME = "app_note_master_db_data";
const DB_VERSION = 1;
const TEMP_DATA_KEY = "0";

const tempStoreData = ["db_type", "data_tree", "global_tags"] as const;

interface MyDB extends DBSchema {
    savedData: {
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

type TSetAllTempDataDBParams = {
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

type TGetDataTreeParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IDataTreeRootFolder | undefined) => void;
};

type TSetGlobalTagsParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IAllTags) => void;
    value: IAllTags;
};

type TGetGlobalTagsParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: IAllTags | undefined) => void;
};

type TSetDbTypeParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: string) => void;
    value: string;
};

type TGetDbTypeDBParams = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: string | undefined) => void;
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

/**
 * Записывает новое значение вместо обьекта db_type в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
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

/**
 * возвращает обьект db_type из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(db_type | undefined): вызывается после поиска
 * @returns Promise<db_type | undefined>
 */
async function getDbTypeDB({ onComplete = def_onComplete, onError = def_onError, callback }: TGetDbTypeDBParams = {}) {
    const db = await openIndexedDB();
    const tx = db.transaction("db_type", "readonly");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    let value = await tx.store.get(TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    return value;
}

/**
 * Записывает новое значение вместо обьекта data_tree в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
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

/**
 * возвращает обьект data_tree из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(data_tree | undefined): вызывается после поиска
 * @returns Promise<data_tree | undefined>
 */
async function getDataTreeDB({ onComplete = def_onComplete, onError = def_onError, callback }: TGetDataTreeParams = {}) {
    const db = await openIndexedDB();
    const tx = db.transaction("data_tree", "readonly");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    let value = await tx.store.get(TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    return value;
}

/**
 * Записывает новое значение вместо обьекта global_tags в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
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
 * возвращает обьект global_tags из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(global_tags | undefined): вызывается после поиска
 * @returns Promise<global_tags | undefined>
 */
async function getGlobalTagsDB({ onComplete = def_onComplete, onError = def_onError, callback }: TGetGlobalTagsParams = {}) {
    const db = await openIndexedDB();
    const tx = db.transaction("global_tags", "readonly");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    let value = await tx.store.get(TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    return value;
}

/**
 * Записывает загржунный фаил IDataSave в indexed db, распределяяя его по блокам
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setAllTempDataDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetAllTempDataDBParams) {
    const db = await openIndexedDB();
    const tx = db.transaction(tempStoreData, "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;

    tx.objectStore("data_tree").put(value.data_tree, TEMP_DATA_KEY);
    tx.objectStore("global_tags").put(value.global_tags, TEMP_DATA_KEY);
    tx.objectStore("db_type").put(value.db_type, TEMP_DATA_KEY);

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

export { delTempDataDB, setAllTempDataDB, setGlobalTagsDB, getGlobalTagsDB, getDataTreeDB, setDataTreeDB, getDbTypeDB, setDbTypeDB };
