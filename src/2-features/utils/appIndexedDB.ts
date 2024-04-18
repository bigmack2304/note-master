// работа с indexed DB через idb
// в indexed DB будем сохранять текущий фаил сохранения с которым работаем.
// кроме этого там будем держать и temp фаил сохранения, который при выходе удалится. (чтобы не держать его в оперативе) (возможно потом както это обыграем)

import { tempStoreData, DB_NAME, DB_VERSION, TEMP_DATA_KEY, def_onComplete, def_onError } from "./appIndexedDBFynctions/appIndexedDBConst";
import { dispatchEventIndexedDBTagsUpdate, dispatchEventIndexedDBTreeUpdate } from "./appIndexedDBFynctions/appIndexedDBEvents";
import { openIndexedDB } from "./appIndexedDBFynctions/openDB";
import type { MyDB, TGetDataEntity, TSetDataEntity } from "./appIndexedDBFynctions/appIndexedDBTypes";
import type { IDataSave } from "0-shared/types/dataSave";

/**
 * Записывает новое значение вместо обьекта db_type в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setDbTypeDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
    value,
}: TSetDataEntity<MyDB["db_type"]["value"]>) {
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
async function getDbTypeDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
}: TGetDataEntity<MyDB["db_type"]["value"] | undefined> = {}) {
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
 * Записывает новое значение вместо обьекта global_tags в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setGlobalTagsDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
    value,
}: TSetDataEntity<MyDB["global_tags"]["value"]>) {
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
async function getGlobalTagsDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
}: TGetDataEntity<MyDB["global_tags"]["value"] | undefined> = {}) {
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
    getDbTypeDB,
    setDbTypeDB,
    saveTempData,
    loadTempDataInSavedData,
    getUnitedTempData,
};
