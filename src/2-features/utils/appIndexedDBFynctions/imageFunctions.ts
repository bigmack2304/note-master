import { def_onComplete, def_onError } from "./appIndexedDBConst";
import { dispatchEventIndexedDBImagesUpdate } from "./appIndexedDBEvents";
import { openIndexedDB } from "./openDB";
import type { TGetKeyDataEntity, MyDB, TSetKeyDataEntity } from "./appIndexedDBTypes";

/**
 * удаляет элемент из data_images по ключу, или много элементов по массиву ключей
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(global_tags | undefined): вызывается после поиска
 * @property key: ключь (ID) элемента который нужно получить
 * @returns Promise<global_tags | undefined>
 */
async function delImageDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
    key,
}: TGetKeyDataEntity<boolean | undefined, string | string[]>) {
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

/**
 * Записывает новое значение в хранилище data_images в indexed db
 * @property onComplete: определение колбека db.transaction,
 * @property onError: определение колбека db.transaction,
 * @property callback(value): вызывается после применения изменений
 * @property value: новое значение
 */
async function setImageDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
    value,
    key,
}: TSetKeyDataEntity<MyDB["data_images"]["value"]>) {
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
async function getImageDB({
    onComplete = def_onComplete,
    onError = def_onError,
    callback,
    key,
}: TGetKeyDataEntity<MyDB["data_images"]["value"] | undefined>) {
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

export { delImageDB, getImageDB, setImageDB };
