import { def_onComplete, def_onError, TEMP_DATA_KEY } from "./appIndexedDBConst";
import { openIndexedDB } from "./openDB";
import { dispatchEventIndexedDBTagsUpdate } from "./appIndexedDBEvents";
import type { MyDB, TSetDataEntity, TGetDataEntity } from "./appIndexedDBTypes";

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

export { setGlobalTagsDB, getGlobalTagsDB };
