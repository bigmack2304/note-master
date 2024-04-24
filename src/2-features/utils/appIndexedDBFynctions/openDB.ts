import { openDB } from "idb";
import { DB_NAME, DB_VERSION } from "./appIndexedDBConst";
import type { MyDB } from "./appIndexedDBTypes";

/**
 * async функция, возвращает обьект indexed db
 * @returns
 */
async function openIndexedDB() {
    const db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            if (oldVersion === newVersion) {
                const savedDataDB = db.createObjectStore("savedData");
                const dbType = db.createObjectStore("db_type");
                const data_tree = db.createObjectStore("data_tree");
                const global_tags = db.createObjectStore("global_tags");
                const data_images = db.createObjectStore("data_images", {
                    keyPath: "id",
                });
                const data_tables = db.createObjectStore("data_tables", {
                    keyPath: "id",
                });
            } else {
                //TODO: при изменении схемы бд, нужно менять версию бд, после чего нежно тут реализовать обновление схемы бд, для новой версии.
                let currentVersion = oldVersion;
                debugger;
                do {
                    switch (currentVersion + 1) {
                        case 1:
                            const savedDataDB = db.createObjectStore("savedData");
                            const dbType = db.createObjectStore("db_type");
                            const data_tree = db.createObjectStore("data_tree");
                            const global_tags = db.createObjectStore("global_tags");
                            break;
                        case 2:
                            const data_images = db.createObjectStore("data_images", {
                                keyPath: "id",
                            });
                            break;
                        case 3:
                            const data_tables = db.createObjectStore("data_tables", {
                                keyPath: "id",
                            });
                            break;
                        default:
                            throw new Error(
                                "A new version of the database has been detected, but the logic for updating the schema has not been implemented."
                            );
                    }
                    currentVersion++;
                } while (currentVersion < (newVersion ?? 1));
            }
        },
        blocked(currentVersion, blockedVersion, event) {},
        blocking(currentVersion, blockedVersion, event) {},
        terminated() {},
    });

    return db;
}

export { openIndexedDB };
