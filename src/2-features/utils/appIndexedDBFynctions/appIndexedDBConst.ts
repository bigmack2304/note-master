/**
 * различные константы и дефолтные значения как либо связанные с indexed db
 */

/**
 * ключи хранилищь в indexed db, в которых могт лежать данные приложения заметок
 */
const tempStoreData = ["db_type", "data_tree", "global_tags", "data_images", "data_tables"] as const;

const DB_NAME = "app_note_master_db_data";
const DB_VERSION = 3;
const TEMP_DATA_KEY = "0";

function def_onError(e: Event) {
    console.warn(e);
}

function def_onComplete(e: Event) {
    //    console.log(e);
}

export { tempStoreData, DB_NAME, DB_VERSION, TEMP_DATA_KEY, def_onError, def_onComplete };
