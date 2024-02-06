import { getNodeById, getAllIdsInNode } from "./saveDataParse";
import { setTempDataDB, getTempDataDB } from "./appIndexedDB";
import type { TchildrenType, TNoteBody, IDataSave, IDataTreeNote, IDataTreeFolder } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { savedIdGenerator } from "0-shared/utils/idGenerator";
// функции для применения изменений к tempData в indexedDB

/**
 * слияние нод по id, tempData с newNode
 * @param newNode измененная нода
 */
function mergeNodeById(newNode: TchildrenType) {
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
/////////////////////////////////////////////////////
/**
 * изменяет своиство value в обьекте заметки
 * @param note обьект заметки
 * @param target_id id компонента в котором нужно поменять value
 * @param newValue новое значение value
 */
function updateNodeName(target_id: string, newName: string) {
    const onGetNode = (node: TchildrenType, allTempData: IDataSave) => {
        if (node) {
            node.name = newName;
            setTempDataDB({ value: allTempData });
        }
    };

    getTempDataDB({
        callback(value) {
            if (!value) return;
            let targetNode = getNodeById(value, target_id);
            if ((targetNode && isDataTreeFolder(targetNode)) || isDataTreeNote(targetNode)) {
                onGetNode(targetNode, value);
            }
        },
    });
}

/**
 * удаление компонента из заметки
 * @param note заметка
 * @param target_id id компонента который нужно удалить
 */
function deleteComponentInNote(note: IDataTreeNote, target_id: string) {
    const insIdGenerator = savedIdGenerator.instatnceIdGenerator;
    if (!insIdGenerator) throw new Error("IdGenerator is not defined");
    const cloneNode = JSON.parse(JSON.stringify(note)) as IDataTreeNote;

    cloneNode.body = cloneNode.body.filter((item) => {
        if (item.id === target_id) {
            insIdGenerator.deleteId(target_id);
            return false;
        }
        return true;
    });

    return cloneNode;
}

/**
 * удаляет ноду по id из tempData в indexedDB
 * @param data - обьект сохранения IDataSave
 * @param target_id - id ноды которую нужно удалить
 */
function deleteById(data: IDataSave, target_id: string) {
    let parent: IDataTreeFolder;
    const insIdGenerator = savedIdGenerator.instatnceIdGenerator;
    if (!insIdGenerator) throw new Error("IdGenerator is not defined");

    const finder = (node: TchildrenType | TNoteBody) => {
        if (node.id === target_id && node.id !== "root") {
            parent.children = parent.children!.filter((child) => {
                if (child.id === target_id) {
                    if (isDataTreeFolder(child) || isDataTreeNote(child)) {
                        getAllIdsInNode(child).map((id) => insIdGenerator.deleteId(id));
                    }
                    insIdGenerator.deleteId(target_id);
                    return false;
                }
                return true;
            });
            return true;
        }

        if (isDataTreeFolder(node)) {
            if (node.children) {
                let temp = parent;
                parent = node;
                for (let child of node.children) {
                    let result = finder(child);
                    if (result) return true;
                }
                parent = temp;
            }
        }
    };

    parent = data.data_tree;
    let result = finder(data.data_tree);
    if (!result) throw new Error(`node not found`);
    setTempDataDB({ value: data });
}

export { mergeNodeById, updateNodeValue, deleteComponentInNote, deleteById, updateNodeName };
