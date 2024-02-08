import { getNodeById, getAllIdsInNode } from "./saveDataParse";
import { setTempDataDB, getTempDataDB } from "./appIndexedDB";
import type { TchildrenType, TNoteBody, IDataSave, IDataTreeFolder, IDataTreeNote } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote, isDataNoteBody } from "0-shared/utils/typeHelpers";
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
 * @param rootFolder обьект IDataSave
 * @param noteId id компонента в котором нужно поменять value
 * @param componentId id компонента в котором меняется value
 * @param newValue новое значение value
 * @returns
 */
function updateNodeValue(rootFolder: IDataSave, noteId: string, componentId: string, newValue: string) {
    let targetNote = getNodeById(rootFolder, noteId);

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== componentId) continue;
            component.value = newValue;
            break;
        }
        setTempDataDB({ value: rootFolder });
    }

    return targetNote;
}

/**
 * изменяет своиство Name в ноде дерева
 * @param rootFolder обьект IDataSave
 * @param target_id id компонента в котором нужно поменять Name
 * @param newValue новое значение Name
 */
function updateNodeName(rootFolder: IDataSave, target_id: string, newName: string) {
    let targetNode = getNodeById(rootFolder, target_id);

    if ((targetNode && isDataTreeFolder(targetNode)) || isDataTreeNote(targetNode)) {
        targetNode.name = newName;
        setTempDataDB({ value: rootFolder });
    }

    return targetNode;
}

/**
 * удаление компонента из заметки
 * @param rootFolder обьект IDataSave
 * @param noteID id заметки
 * @param componentID id компонента который нужно удалить
 */
function deleteComponentInNote(rootFolder: IDataSave, noteID: string, componentID: string) {
    const insIdGenerator = savedIdGenerator.instatnceIdGenerator;
    if (!insIdGenerator) throw new Error("IdGenerator is not defined");

    let targetNote = getNodeById(rootFolder, noteID);

    if (targetNote && isDataTreeNote(targetNote)) {
        targetNote.body = targetNote.body.filter((item) => {
            if (item.id === componentID) {
                insIdGenerator.deleteId(componentID);
                return false;
            }
            return true;
        });

        setTempDataDB({ value: rootFolder });
    }
    return targetNote;
}

/**
 * удаляет ноду типа TchildrenType по id из tempData в indexedDB
 * @param data - обьект сохранения IDataSave
 * @param target_id - id ноды которую нужно удалить
 */
function deleteById(data: IDataSave, target_id: string) {
    let parent: IDataTreeFolder;
    let deletedNode: TchildrenType | undefined;
    const insIdGenerator = savedIdGenerator.instatnceIdGenerator;
    if (!insIdGenerator) throw new Error("IdGenerator is not defined");

    const finder = (node: TchildrenType) => {
        if (node.id === target_id && node.id !== "root") {
            parent.children = parent.children!.filter((child) => {
                if (child.id === target_id) {
                    if (isDataTreeFolder(child) || isDataTreeNote(child)) {
                        getAllIdsInNode(child).map((id) => insIdGenerator.deleteId(id));
                    }
                    insIdGenerator.deleteId(target_id);
                    deletedNode = child;
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
    return deletedNode;
}

/**
 * Добавляет ноду в дерево
 * @param data - обьект сохранения IDataSave
 * @param insertToId - id ноды в которую нужно добавить
 * @param newNode - обьект новой ноды (классы из 0-shared/utils/saveData... .ts)
 */
async function addNodeTo(data: IDataSave, insertToId: string, newNode: TchildrenType | TNoteBody): Promise<null | IDataTreeFolder | IDataTreeNote | TNoteBody> {
    let targetNode = getNodeById(data, insertToId);

    if (!targetNode) return null;

    // в папку мы можем добавить другую папку или заметку
    if (isDataTreeFolder(targetNode) && (isDataTreeFolder(newNode) || isDataTreeNote(newNode))) {
        if (!targetNode.children) targetNode.children = [];
        targetNode.children.push(newNode);
        setTempDataDB({ value: data });
        return newNode;
    }

    // в заметку мы можем добавить компонент
    if (isDataTreeNote(targetNode) && isDataNoteBody(newNode)) {
        targetNode.body.push(newNode);
        setTempDataDB({ value: data });
        return newNode;
    }

    return null;
}

export { mergeNodeById, updateNodeValue, deleteComponentInNote, deleteById, updateNodeName, addNodeTo };
