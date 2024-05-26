import { EV_NAME_UPD_SESSION_STORAGE } from "5-app/settings";

// определение сессионого-стораджа всего приложения

// тип сессионого стораджа приложения
interface IAppSessionStorage {
    appLogs: { type: "log" | "warn" | "error" | "user"; value: string }[];
}

const STORAGE_KEY = "app_note_master_session_data";

const STORAGE_DEF_VALUE: IAppSessionStorage = {
    appLogs: [],
};

/**
 * возвращает состояние session storage в виде обьекта
 * @returns
 */
function get_session_stprage_data() {
    const read_data = sessionStorage.getItem(STORAGE_KEY);

    if (read_data !== null) {
        return JSON.parse(read_data) as IAppSessionStorage;
    }

    return STORAGE_DEF_VALUE;
}

/**
 * перезаписывает session storage новыми данными
 * @param data
 */
function set_session_storage_data(data: IAppSessionStorage) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    dispatchEventSessionStorageUpdate();
}

/**
 * генерирует событие при вызове set_session_storage_data
 */
function dispatchEventSessionStorageUpdate() {
    window.dispatchEvent(new CustomEvent(EV_NAME_UPD_SESSION_STORAGE));
}

/**
 * более красивый способ перезаписи отдельных значений в session storage.
 * Альтернатива этому: set_session_storage_data({ ...get_session_stprage_data(), key: new_value });
 * @param key ключ в sessionStorage
 * @param value новое значение
 */
function session_storage_save_value<K extends keyof IAppSessionStorage>(key: K, value: IAppSessionStorage[K]) {
    set_session_storage_data({ ...get_session_stprage_data(), [key]: value });
}

/**
 * инициалация session storage если он еще не создан
 */
function session_storage_init() {
    const is_storage = sessionStorage.getItem(STORAGE_KEY);

    if (is_storage === null) {
        set_session_storage_data(STORAGE_DEF_VALUE);
    }
}

session_storage_init();

export { STORAGE_KEY, STORAGE_DEF_VALUE, get_session_stprage_data, set_session_storage_data, session_storage_save_value };
export type { IAppSessionStorage };
