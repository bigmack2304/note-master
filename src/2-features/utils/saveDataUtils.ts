import type { IDataSave, TchildrenType } from "0-shared/types/dataSave";
// разные вспомогательные функции для работы с tempData в indexedDB

/**
 * возвращает обьект TchildrenType без поля children
 * @param node обьект типа IDataTreeFolder | IDataTreeNote
 * @returns
 */
function nodeWithoutChildren(node: TchildrenType) {
    let obj: any = {};

    for (let elem in node) {
        if (elem === "children") continue;
        obj[elem] = node[elem as keyof typeof node];
    }
    return obj as TchildrenType;
}

/**
 * скачивает проект на устройство
 * @param filename - имя фаила
 * @param dataObjToWrite - обьект IDataSave
 */
const saveDataAsFile = (filename: string, dataObjToWrite: IDataSave) => {
    let json_data = JSON.stringify(dataObjToWrite);

    const blob = new Blob([json_data], {
        type: "text/json",
    });
    const link = document.createElement("a");
    link.download = `${filename}.json`;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    link.dispatchEvent(evt);
    link.remove();
};

export { nodeWithoutChildren, saveDataAsFile };
