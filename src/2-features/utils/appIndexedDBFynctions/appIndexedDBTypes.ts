import { DBSchema } from "idb";
import type { IDataSave, IDataTreeRootFolder, IAllTags, TTableValue } from "0-shared/types/dataSave";

/**
 * тип базы данных indexed db с хранением данных о заметках
 */
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

export type { MyDB, TSetDataEntity, TGetDataEntity, TSetKeyDataEntity, TGetKeyDataEntity };
