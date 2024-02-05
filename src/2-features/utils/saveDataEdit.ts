import { getNodeById } from "./saveDataParse";
import { setTempDataDB, getTempDataDB } from "./appIndexedDB";
import type { TchildrenType, TNoteBody, IDataSave, IDataTreeNote } from "0-shared/types/dataSave";

// функции для применения изменений к tempData в indexedDB

/**
 * слияние нод по id, tempData с newNode
 * @param newNode измененная нода
 */
async function mergeNodeById(newNode: TchildrenType) {
    const target_id = newNode.id;

    const onGetNode = (node: TchildrenType | TNoteBody | null, allTempData: IDataSave) => {
        if (node) {
            Object.assign(node, newNode);
            setTempDataDB({ value: allTempData });
        }
    };

    getTempDataDB({
        callback(value) {
            if (!value) return;
            let findResult = getNodeById(value, target_id);
            onGetNode(findResult, value);
        },
    });
}

/**
 * изменяет своиство value в обьекте заметки
 * @param note обьект заметки
 * @param target_id id компонента в котором нужно поменять value
 * @param newValue новое значение value
 * @returns
 */
function updateNodeValue(note: IDataTreeNote, target_id: string, newValue: string) {
    const cloneNode = JSON.parse(JSON.stringify(note)) as IDataTreeNote;

    for (let component of cloneNode.body) {
        if (component.id !== target_id) continue;
        component.value = newValue;
    }

    return cloneNode;
}

/**
 * удаление компонента из заметки
 * @param note заметка
 * @param target_id id компонента который нужно удалить
 */
function deleteComponentInNote(note: IDataTreeNote, target_id: string) {
    const cloneNode = JSON.parse(JSON.stringify(note)) as IDataTreeNote;
    cloneNode.body = cloneNode.body.filter((item) => item.id !== target_id);

    return cloneNode;
}

export { mergeNodeById, updateNodeValue, deleteComponentInNote };
