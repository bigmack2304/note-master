import { isDWorkerScope } from "0-shared/utils/scopeChecks";

/**
 * генерация событий на обьекте window при изменениях в indexed db (myDB)
 */

function dispatchEventIndexedDBTreeUpdate() {
    if (!isDWorkerScope()) {
        window.dispatchEvent(new CustomEvent("appIndexedDBTreeUpdate"));
    } else {
        //eslint-disable-next-line
        self.postMessage("worker generate event: appIndexedDBTreeUpdate");
    }
}

function dispatchEventIndexedDBTagsUpdate() {
    if (!isDWorkerScope()) {
        window.dispatchEvent(new CustomEvent("appIndexedDBTagsUpdate"));
    } else {
        //eslint-disable-next-line
        self.postMessage("worker generate event: appIndexedDBTagsUpdate");
    }
}

function dispatchEventIndexedDBImagesUpdate() {
    if (!isDWorkerScope()) {
        window.dispatchEvent(new CustomEvent("appIndexedDBImagesUpdate"));
    } else {
        //eslint-disable-next-line
        self.postMessage("worker generate event: appIndexedDBImagesUpdate");
    }
}

function dispatchEventIndexedDBTableUpdate() {
    if (!isDWorkerScope()) {
        window.dispatchEvent(new CustomEvent("appIndexedDBTablesUpdate"));
    } else {
        //eslint-disable-next-line
        self.postMessage("worker generate event: appIndexedDBTablesUpdate");
    }
}

export {
    dispatchEventIndexedDBTreeUpdate,
    dispatchEventIndexedDBTagsUpdate,
    dispatchEventIndexedDBImagesUpdate,
    dispatchEventIndexedDBTableUpdate,
};
