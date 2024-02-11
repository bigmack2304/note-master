import { getNodeById, getAllIdsInNode, getParentNode } from "./saveDataParse";
import { setDataTreeDB, getDataTreeDB } from "./appIndexedDB";
import type { TchildrenType, TNoteBody, IDataTreeFolder, IDataTreeNote, IDataTreeRootFolder, IGlobalTag } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote, isDataNoteBody } from "0-shared/utils/typeHelpers";
import { savedIdGenerator } from "0-shared/utils/idGenerator";
// функции для применения изменений к tempData в indexedDB

/**
 * слияние нод по id, tempData с newNode
 * @param newNode измененная нода
 */
function mergeNodeById(newNode: TchildrenType) {
    const target_id = newNode.id;

    const onGetNode = (node: TchildrenType | TNoteBody | null, allTempData: IDataTreeRootFolder) => {
        if (node) {
            Object.assign(node, newNode);
            setDataTreeDB({ value: allTempData });
        }
    };

    getDataTreeDB({
        callback(value) {
            if (!value) return;
            let findResult = getNodeById(value, target_id);
            onGetNode(findResult, value);
        },
    });
}

/**
 * изменяет своиство value в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id компонента в котором нужно поменять value
 * @param componentId id компонента в котором меняется value
 * @param newValue новое значение value
 * @returns
 */
function updateNodeValue(rootFolder: IDataTreeRootFolder, noteId: string, componentId: string, newValue: string) {
    let targetNote = getNodeById(rootFolder, noteId);

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== componentId) continue;
            component.value = newValue;
            break;
        }
        setDataTreeDB({ value: rootFolder });
    }

    return targetNote;
}

/**
 * изменяет своиство Name в ноде дерева
 * @param rootFolder обьект IDataTreeRootFolder
 * @param target_id id компонента в котором нужно поменять Name
 * @param newValue новое значение Name
 */
function updateNodeName(rootFolder: IDataTreeRootFolder, target_id: string, newName: string) {
    let targetNode = getNodeById(rootFolder, target_id);

    if ((targetNode && isDataTreeFolder(targetNode)) || isDataTreeNote(targetNode)) {
        targetNode.name = newName;
        setDataTreeDB({ value: rootFolder });
    }

    return targetNode;
}

/**
 * удаление компонента из заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteID id заметки
 * @param componentID id компонента который нужно удалить
 */
function deleteComponentInNote(rootFolder: IDataTreeRootFolder, noteID: string, componentID: string) {
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

        setDataTreeDB({ value: rootFolder });
    }
    return targetNote;
}

/**
 * удаляет ноду типа TchildrenType по id из tempData в indexedDB
 * @param data - обьект сохранения IDataTreeRootFolder
 * @param target_id - id ноды которую нужно удалить
 */
function deleteById(data: IDataTreeRootFolder, target_id: string) {
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

    parent = data;
    let result = finder(data);
    if (!result) throw new Error(`node not found`);
    setDataTreeDB({ value: data });
    return deletedNode;
}

/**
 * Добавляет ноду в дерево
 * @param data - обьект сохранения IDataTreeRootFolder
 * @param insertToId - id ноды в которую нужно добавить
 * @param newNode - обьект новой ноды (классы из 0-shared/utils/saveData... .ts)
 */
async function addNodeTo(data: IDataTreeRootFolder, insertToId: string, newNode: TchildrenType | TNoteBody): Promise<null | IDataTreeFolder | IDataTreeNote | TNoteBody> {
    let targetNode = getNodeById(data, insertToId);

    if (!targetNode) return null;

    // в папку мы можем добавить другую папку или заметку
    if (isDataTreeFolder(targetNode) && (isDataTreeFolder(newNode) || isDataTreeNote(newNode))) {
        if (!targetNode.children) targetNode.children = [];
        targetNode.children.push(newNode);
        setDataTreeDB({ value: data });
        return newNode;
    }

    // в заметку мы можем добавить компонент
    if (isDataTreeNote(targetNode) && isDataNoteBody(newNode)) {
        targetNode.body.push(newNode);
        setDataTreeDB({ value: data });
        return newNode;
    }

    return null;
}

/**
 * перемещает заметку или папку в другую папку
 * @param data - обьект сохранения IDataTreeRootFolder
 * @param muvedNodeID - id ноды которую перемещаем
 * @param muveToID - id ноды куда перемещаем
 */
async function nodeMuveTo(data: IDataTreeRootFolder, muvedNodeID: string, muveToID: string): Promise<IDataTreeFolder | IDataTreeNote | TNoteBody | null> {
    let muvedNode = getNodeById(data, muvedNodeID);
    let muvedNodeParent = muvedNode && getParentNode(data, muvedNode.id);
    let moveToNode = getNodeById(data, muveToID);

    if (!muvedNode || !muvedNodeParent || !moveToNode) return null;
    if (muvedNodeParent.id === moveToNode.id) return muvedNode; // если, откуда = куда перемещаем то ничего не делаем
    if (moveToNode.id === muvedNodeID) return muvedNode; // чтобы нельзя было перемещать элементы самих в себя

    // убераем muvedNode из дочерних элементов muvedNodeParent
    if (isDataTreeFolder(muvedNodeParent)) {
        muvedNodeParent.children = muvedNodeParent.children!.filter((element) => {
            if (element.id === muvedNode!.id) return false;
            return true;
        });
    }

    if (isDataTreeFolder(moveToNode)) {
        if (!isDataTreeFolder(muvedNode) && !isDataTreeNote(muvedNode)) return null;
        if (!moveToNode.children) moveToNode.children = [];
        moveToNode.children.push(muvedNode);
        setDataTreeDB({ value: data });
        return muvedNode;
    }

    return null;
}

/**
 * удаляет тег у заметки
 * @param data обьект IDataTreeRootFolder
 * @param targetNoteID id заметки в которой удаляем
 * @param tag обьект тега который нужно убрать
 */
async function noteDeleteTag(data: IDataTreeRootFolder, targetNoteID: string, tag: IGlobalTag) {
    let targetNote = getNodeById(data, targetNoteID);

    if (!targetNote) return null;
    if (!isDataTreeNote(targetNote)) return null;
    if (!("tags" in targetNote)) return null;

    targetNote.tags = targetNote.tags!.filter((tagName) => {
        if (tagName === tag.tag_name) return false;
        return true;
    });

    setDataTreeDB({ value: data });

    return targetNote;
}

/**
 * добавляет тег в заметку
 * @param data обьект IDataTreeRootFolder
 * @param targetNoteID id заметки в которую добавляем
 * @param tag имена тегов которые нужно добавить
 */
async function noteAddTag(data: IDataTreeRootFolder, targetNoteID: string, tag: string | string[]) {
    let targetNote = getNodeById(data, targetNoteID);

    let prepareTags: string[] = [];

    if (Array.isArray(tag) && tag.length > 0) {
        prepareTags = [...tag];
    }

    if (typeof tag === "string" && tag !== "") {
        prepareTags.push(tag);
    }

    if (!targetNote) return null;
    if (!isDataTreeNote(targetNote)) return null;

    if (!("tags" in targetNote)) {
        targetNote.tags = [];
    }

    targetNote.tags = targetNote.tags!.concat(prepareTags);

    setDataTreeDB({ value: data });

    return targetNote;
}

export { mergeNodeById, updateNodeValue, deleteComponentInNote, deleteById, updateNodeName, addNodeTo, nodeMuveTo, noteDeleteTag, noteAddTag };
