import { AUTO_THEME_DETECT } from "5-app/settings";

// определение локал-стораджа всего приложения
// тип локал стораджа приложения

interface IAppLocalStorage {
    isDark: boolean;
    isAuto: boolean;
}

const STORAGE_KEY = "app_note_master_local_data";

const STORAGE_DEF_VALUE: IAppLocalStorage = {
    isDark: false,
    isAuto: AUTO_THEME_DETECT,
};

// возвращает состояние local storage в виде обьекта
function get_stprage_data() {
    const read_data = localStorage.getItem(STORAGE_KEY);

    if (read_data !== null) {
        return JSON.parse(read_data) as IAppLocalStorage;
    }

    return STORAGE_DEF_VALUE;
}

// перезаписывает local storage новыми данными
function set_storage_data(data: IAppLocalStorage) {
    dispatchEventStorageUpdate();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// генерирует событие при вызове set_storage_data
function dispatchEventStorageUpdate() {
    window.dispatchEvent(new CustomEvent("appLocalStorageUpdate"));
}

// более красивый способ перезаписи отдельных значений в local storage
// альтернатива этому: set_storage_data({ ...get_stprage_data(), key: new_value });
function storage_save_value<K extends keyof IAppLocalStorage>(key: K, value: IAppLocalStorage[K]) {
    set_storage_data({ ...get_stprage_data(), [key]: value });
}

// инициализируем local storage если он еще не создан
storage_init();
function storage_init() {
    const is_storage = localStorage.getItem(STORAGE_KEY);

    if (is_storage === null) {
        set_storage_data(STORAGE_DEF_VALUE);
    }
}

export { STORAGE_KEY, STORAGE_DEF_VALUE, get_stprage_data, set_storage_data, storage_save_value };
export type { IAppLocalStorage };
