import { def_onComplete, def_onError, TEMP_DATA_KEY } from "./appIndexedDBConst";
import { openIndexedDB } from "./openDB";
import { dispatchEventIndexedDBTreeUpdate } from "./appIndexedDBEvents";
import type { MyDB, TSetDataEntity, TGetDataEntity } from "./appIndexedDBTypes";

/**
 * Записывает новое значение вместо обьекта data_tree в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setDataTreeDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
    value,
}: TSetDataEntity<MyDB["data_tree"]["value"]>) {
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
async function getDataTreeDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
}: TGetDataEntity<MyDB["data_tree"]["value"] | undefined> = {}) {
    const db = await openIndexedDB();
    const tx = db.transaction("data_tree", "readonly");
    tx.onerror = onError;
    tx.oncomplete = onComplete;
    let value = await tx.store.get(TEMP_DATA_KEY);
    await tx.done;
    callback && callback(value);
    return value;
}

export { getDataTreeDB, setDataTreeDB };
