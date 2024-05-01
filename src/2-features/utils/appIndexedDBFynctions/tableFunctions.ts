import { def_onComplete, def_onError } from "./appIndexedDBConst";
import { dispatchEventIndexedDBTableUpdate } from "./appIndexedDBEvents";
import { openIndexedDB } from "./openDB";
import type { MyDB, TSetKeyDataEntity, TGetKeyDataEntity } from "./appIndexedDBTypes";

/**
 * Записывает новое значение в хранилище data_table в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setTableDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
    value,
    key,
}: TSetKeyDataEntity<MyDB["data_tables"]["value"]>) {
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
async function getTableDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
    key,
}: TGetKeyDataEntity<MyDB["data_tables"]["value"] | undefined>) {
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
async function delTableDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
    key,
}: TGetKeyDataEntity<boolean | undefined, string | string[]>) {
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

export { delTableDB, setTableDB, getTableDB };
