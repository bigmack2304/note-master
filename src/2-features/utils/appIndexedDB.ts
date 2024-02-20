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

type TSetDataEntity<SET_TYPE> = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: SET_TYPE | undefined) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    value: SET_TYPE;
};

type TGetDataEntity<CALLBACK_PARAM> = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: CALLBACK_PARAM) => void;
};

function def_onError(e: Event) {
    console.warn(e);
}

function def_onComplete(e: Event) {
    //    console.log(e);
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
async function setDbTypeDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetDataEntity<MyDB["db_type"]["value"]>) {
    const db = await openIndexedDB();
    const tx = db.transaction("db_type", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    tx.store.put(value, TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    //dispatchEventIndexedDBTempUpdate();
    return value;
}

/**
 * возвращает обьект db_type из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(db_type | undefined): вызывается после поиска
 * @returns Promise<db_type | undefined>
 */
async function getDbTypeDB({ onComplete = def_onComplete, onError = def_onError, callback }: TGetDataEntity<MyDB["db_type"]["value"] | undefined> = {}) {
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
async function setDataTreeDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetDataEntity<MyDB["data_tree"]["value"]>) {
    const db = await openIndexedDB();
    const tx = db.transaction("data_tree", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    tx.store.put(value, TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBTreeUpdate();
    return value;
}

/**
 * возвращает обьект data_tree из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(data_tree | undefined): вызывается после поиска
 * @returns Promise<data_tree | undefined>
 */
async function getDataTreeDB({ onComplete = def_onComplete, onError = def_onError, callback }: TGetDataEntity<MyDB["data_tree"]["value"] | undefined> = {}) {
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
async function setGlobalTagsDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetDataEntity<MyDB["global_tags"]["value"]>) {
    const db = await openIndexedDB();
    const tx = db.transaction("global_tags", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    tx.store.put(value, TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBTagsUpdate();
    return value;
}

/**
 * возвращает обьект global_tags из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(global_tags | undefined): вызывается после поиска
 * @returns Promise<global_tags | undefined>
 */
async function getGlobalTagsDB({ onComplete = def_onComplete, onError = def_onError, callback }: TGetDataEntity<MyDB["global_tags"]["value"] | undefined> = {}) {
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
async function setAllTempDataDB({ onComplete = def_onComplete, onError = def_onError, callback, value }: TSetDataEntity<IDataSave>) {
    const db = await openIndexedDB();
    const tx = db.transaction(tempStoreData, "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;

    tx.objectStore("data_tree").put(value.data_tree, TEMP_DATA_KEY);
    tx.objectStore("global_tags").put(value.global_tags, TEMP_DATA_KEY);
    tx.objectStore("db_type").put(value.db_type, TEMP_DATA_KEY);

    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBTreeUpdate();
    return value;
}

/**
 * удаляет временные данные из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(): вызывается после применения изменений
 */
async function delTempDataDB({ onComplete = def_onComplete, onError = def_onError, callback }: TGetDataEntity<void> = {}) {
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
 * помещает временные данные из indexed db в сохраненные данные
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(): вызывается после применения изменений
 */
async function saveTempData({ onComplete = def_onComplete, onError = def_onError, callback }: TGetDataEntity<boolean> = {}) {
    const db = await openIndexedDB();

    // const td = db.transaction(tempStoreData, "readonly");
    // td.onerror = onError;
    // td.oncomplete = onComplete;
    // const temp_dbType = await td.objectStore("db_type").get(TEMP_DATA_KEY);
    // const temp_globTags = await td.objectStore("global_tags").get(TEMP_DATA_KEY);
    // const temp_tree = await td.objectStore("data_tree").get(TEMP_DATA_KEY);
    // await td.done;

    // if (!temp_dbType || !temp_globTags || !temp_tree) {
    //     callback && callback(false);
    //     return false;
    // }

    // const allTempData = {
    //     db_type: temp_dbType as "note_Master",
    //     global_tags: temp_globTags,
    //     data_tree: temp_tree,
    // };

    const allTempData = await getUnitedTempData();

    if (!allTempData) {
        callback && callback(false);
        return false;
    }

    const sd = db.transaction("savedData", "readwrite");
    sd.onerror = onError;
    sd.oncomplete = onComplete;
    sd.store.put(allTempData, TEMP_DATA_KEY);
    await sd.done;
    callback && callback(true);
    return true;
}

/**
 * обьеденяет все временные фаилы и возвращает их в в иде обьекта IDataSave
 *
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(): вызывается после применения изменений
 */
async function getUnitedTempData({ onComplete = def_onComplete, onError = def_onError, callback }: TGetDataEntity<boolean> = {}) {
    const db = await openIndexedDB();

    const td = db.transaction(tempStoreData, "readonly");
    td.onerror = onError;
    td.oncomplete = onComplete;
    const temp_dbType = await td.objectStore("db_type").get(TEMP_DATA_KEY);
    const temp_globTags = await td.objectStore("global_tags").get(TEMP_DATA_KEY);
    const temp_tree = await td.objectStore("data_tree").get(TEMP_DATA_KEY);
    await td.done;

    if (!temp_dbType || !temp_globTags || !temp_tree) {
        callback && callback(false);
        return false;
    }

    const allTempData = {
        db_type: temp_dbType as "note_Master",
        global_tags: temp_globTags,
        data_tree: temp_tree,
    };

    callback && callback(true);
    return allTempData;
}

/**
 * получает сохраненные данные из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(): вызывается после применения изменений
 */
async function loadTempDataInSavedData({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
}: TGetDataEntity<{ resultBool: boolean; data: IDataSave | undefined }> = {}) {
    const db = await openIndexedDB();

    const sd = db.transaction("savedData", "readonly");
    sd.onerror = onError;
    sd.oncomplete = onComplete;
    const saved_db_data = await sd.store.get(TEMP_DATA_KEY);
    await sd.done;

    if (!saved_db_data) {
        callback && callback({ resultBool: false, data: undefined });
        return { resultBool: false, data: undefined };
    }

    callback && callback({ resultBool: true, data: saved_db_data });
    return { resultBool: true, data: saved_db_data };
}

/**
 * генерирует событие при вызове set_storage...
 */
function dispatchEventIndexedDBTreeUpdate() {
    window.dispatchEvent(new CustomEvent("appIndexedDBTreeUpdate"));
}

function dispatchEventIndexedDBTagsUpdate() {
    window.dispatchEvent(new CustomEvent("appIndexedDBTagsUpdate"));
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

export {
    delTempDataDB,
    setAllTempDataDB,
    setGlobalTagsDB,
    getGlobalTagsDB,
    getDataTreeDB,
    setDataTreeDB,
    getDbTypeDB,
    setDbTypeDB,
    saveTempData,
    loadTempDataInSavedData,
    getUnitedTempData,
};
