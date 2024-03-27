// работа с indexed DB через idb
// в indexed DB будем сохранять текущий фаил сохранения с которым работаем.
// кроме этого там будем держать и temp фаил сохранения, который при выходе удалится. (чтобы не держать его в оперативе) (возможно потом както это обыграем)

import { openDB, DBSchema } from "idb";
import type { IDataSave, IDataTreeRootFolder, IAllTags, TTableValue } from "0-shared/types/dataSave";

const DB_NAME = "app_note_master_db_data";
const DB_VERSION = 1;
const TEMP_DATA_KEY = "0";

const tempStoreData = ["db_type", "data_tree", "global_tags", "data_images", "data_tables"] as const;

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
    data_images: {
        value: {
            id: string;
            src: string;
        };
        key: string;
    };
    data_tables: {
        value: {
            id: string;
            value: TTableValue;
        };
        key: string;
    };
}

type TSetDataEntity<SET_TYPE> = Omit<TSetKeyDataEntity<SET_TYPE>, "key">;
type TGetDataEntity<CALLBACK_PARAM> = Omit<TGetKeyDataEntity<CALLBACK_PARAM>, "key">;

type TSetKeyDataEntity<SET_TYPE> = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: SET_TYPE | undefined) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    value: SET_TYPE;
    key: string;
};

type TGetKeyDataEntity<CALLBACK_PARAM, KEY_TYPE = string> = {
    onComplete?: (this: IDBTransaction, ev: Event) => void;
    onError?: (this: IDBTransaction, ev: Event) => void;
    callback?: (value: CALLBACK_PARAM) => void;
    key: KEY_TYPE;
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

            const data_images = db.createObjectStore("data_images", {
                keyPath: "id",
            });

            const data_tables = db.createObjectStore("data_tables", {
                keyPath: "id",
            });
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
 * Записывает новое значение в хранилище data_images в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setImageDB({ onComplete = def_onComplete, onError = def_onError, callback, value, key }: TSetKeyDataEntity<MyDB["data_images"]["value"]>) {
    const db = await openIndexedDB();
    const tx = db.transaction("data_images", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;

    const hasItemInDB = await tx.store.getKey(key);
    if (hasItemInDB) {
        await tx.store.delete(key);
    }

    await tx.store.add(value);
    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBImagesUpdate();
    return value;
}

/**
 * возвращает элемент из data_images из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(global_tags | undefined): вызывается после поиска
 * @property key: ключь (ID) элемента который нужно получить
 * @returns Promise<global_tags | undefined>
 */
async function getImageDB({ onComplete = def_onComplete, onError = def_onError, callback, key }: TGetKeyDataEntity<MyDB["data_images"]["value"] | undefined>) {
    if (!key) throw new Error("key ");
    const db = await openIndexedDB();
    const tx = db.transaction("data_images", "readonly");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    let value = await tx.store.get(key);
    await tx.done;
    callback && callback(value);
    return value;
}

/**
 * удаляет элемент из data_images по ключу, или много элементов по массиву ключей
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(global_tags | undefined): вызывается после поиска
 * @property key: ключь (ID) элемента который нужно получить
 * @returns Promise<global_tags | undefined>
 */
async function delImageDB({ onComplete = def_onComplete, onError = def_onError, callback, key }: TGetKeyDataEntity<boolean | undefined, string | string[]>) {
    if (!key) throw new Error("the key is required");
    const db = await openIndexedDB();
    const tx = db.transaction("data_images", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    if (Array.isArray(key)) {
        for await (let keyItem of key) {
            tx.store.delete(keyItem);
        }
    } else {
        await tx.store.delete(key);
    }
    await tx.done;
    callback && callback(true);
    dispatchEventIndexedDBImagesUpdate();
    return true;
}

///////////////////////////////////////////////

/**
 * Записывает новое значение в хранилище data_table в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setTableDB({ onComplete = def_onComplete, onError = def_onError, callback, value, key }: TSetKeyDataEntity<MyDB["data_tables"]["value"]>) {
    const db = await openIndexedDB();
    const tx = db.transaction("data_tables", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;

    const hasItemInDB = await tx.store.getKey(key);
    if (hasItemInDB) {
        await tx.store.delete(key);
    }

    await tx.store.add(value);
    await tx.done;
    callback && callback(value);
    dispatchEventIndexedDBTableUpdate();
    return value;
}

/**
 * возвращает элемент из data_table из indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(global_tags | undefined): вызывается после поиска
 * @property key: ключь (ID) элемента который нужно получить
 * @returns Promise<global_tags | undefined>
 */
async function getTableDB({ onComplete = def_onComplete, onError = def_onError, callback, key }: TGetKeyDataEntity<MyDB["data_tables"]["value"] | undefined>) {
    if (!key) throw new Error("key ");
    const db = await openIndexedDB();
    const tx = db.transaction("data_tables", "readonly");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    let value = await tx.store.get(key);
    await tx.done;
    callback && callback(value);
    return value;
}

/**
 * удаляет элемент из data_table по ключу, или много элементов по массиву ключей
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(global_tags | undefined): вызывается после поиска
 * @property key: ключь (ID) элемента который нужно получить
 * @returns Promise<global_tags | undefined>
 */
async function delTableDB({ onComplete = def_onComplete, onError = def_onError, callback, key }: TGetKeyDataEntity<boolean | undefined, string | string[]>) {
    if (!key) throw new Error("the key is required");
    const db = await openIndexedDB();
    const tx = db.transaction("data_tables", "readwrite");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    if (Array.isArray(key)) {
        for await (let keyItem of key) {
            tx.store.delete(keyItem);
        }
    } else {
        await tx.store.delete(key);
    }
    await tx.done;
    callback && callback(true);
    dispatchEventIndexedDBTableUpdate();
    return true;
}

///////////////////////////////////////////////

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

    for (let img in value.data_images) {
        tx.objectStore("data_images").put(value.data_images[img]);
    }

    for (let table_item in value.data_tables) {
        tx.objectStore("data_tables").put(value.data_tables[table_item]);
    }

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
        if (storeName === "data_images" || storeName == "data_tables") {
            await tx.objectStore(storeName).clear();
            continue;
        }

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
    let temp_images = await td.objectStore("data_images").getAll();
    let temp_tables = await td.objectStore("data_tables").getAll();
    await td.done;

    if (!temp_dbType || !temp_globTags || !temp_tree || !temp_images || !temp_tables) {
        callback && callback(false);
        return false;
    }

    const prepate_images: any = {};
    const prepate_tables: any = {};

    for (let img of temp_images) {
        prepate_images[img.id] = img;
    }
    temp_images = [];

    for (let table_item of temp_tables) {
        prepate_tables[table_item.id] = table_item;
    }
    temp_tables = [];

    const allTempData = {
        db_type: temp_dbType as "note_Master",
        global_tags: temp_globTags,
        data_tree: temp_tree,
        data_images: prepate_images,
        data_tables: prepate_tables,
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
 * генерация событий на обьекте window
 */
function dispatchEventIndexedDBTreeUpdate() {
    window.dispatchEvent(new CustomEvent("appIndexedDBTreeUpdate"));
}

function dispatchEventIndexedDBTagsUpdate() {
    window.dispatchEvent(new CustomEvent("appIndexedDBTagsUpdate"));
}

function dispatchEventIndexedDBImagesUpdate() {
    window.dispatchEvent(new CustomEvent("appIndexedDBImagesUpdate"));
}

function dispatchEventIndexedDBTableUpdate() {
    window.dispatchEvent(new CustomEvent("appIndexedDBTablesUpdate"));
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
    setImageDB,
    getImageDB,
    delImageDB,
    setTableDB,
    getTableDB,
    delTableDB,
};
