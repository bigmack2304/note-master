import { getNodeById, getAllIdsInNode, getParentNode, getAllNotes } from "./saveDataParse";
import { setDataTreeDB, getDataTreeDB, setGlobalTagsDB, getGlobalTagsDB } from "./appIndexedDB";
import type { TchildrenType, TNoteBody, IDataTreeFolder, IDataTreeNote, IDataTreeRootFolder, IGlobalTag, IAllTags, TTagColors, TAllComponents } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote, isDataNoteBody } from "0-shared/utils/typeHelpers";
import { savedIdGenerator } from "0-shared/utils/idGenerator";
import { DataTag } from "0-shared/utils/saveDataTag";
import { DataComponentHeader } from "0-shared/utils/saveDataComponentHeader";
import type { DataNote } from "0-shared/utils/saveDataNote";
import type { DataFolder } from "0-shared/utils/saveDataFolder";
// функции для применения изменений к tempData в indexedDB

/**
 * слияние нод по id, tempData с newNode
 * @param newNode измененная нода
 */
// async function mergeNodeById(newNode: TchildrenType) {
//     const target_id = newNode.id;

//     const onGetNode = (node: TchildrenType | TNoteBody | null, allTempData: IDataTreeRootFolder) => {
//         if (node) {
//             Object.assign(node, newNode);
//             setDataTreeDB({ value: allTempData });
//         }
//     };

//     getDataTreeDB({
//         callback(value) {
//             if (!value) return;
//             let findResult = getNodeById(value, target_id);
//             onGetNode(findResult, value);
//         },
//     });
// }

/**
 * изменяет своиство completed в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой нужно поменять completed
 * @param newValue новое значение completed
 * @returns
 */
async function updateNodeCompleted(rootFolder: IDataTreeRootFolder, noteId: string, newValue: boolean) {
    let targetNote = getNodeById(rootFolder, noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        if (targetNote.completed !== newValue) {
            targetNote.completed = newValue;
            resultBool = true;
            targetNote.lastEditTime = Date.now();
            await setDataTreeDB({ value: rootFolder });
        }
        resultBool = true;
    }

    return { targetNote, resultBool };
}

/**
 * изменяет своиство value в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id компонента в котором нужно поменять value
 * @param componentId id компонента в котором меняется value
 * @param newValue новое значение value
 * @returns
 */
async function updateNodeValue(rootFolder: IDataTreeRootFolder, noteId: string, componentId: string, newValue: string) {
    let targetNote = getNodeById(rootFolder, noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== componentId) continue;
            component.value = newValue;
            break;
        }

        targetNote.lastEditTime = Date.now();
        resultBool = true;
        await setDataTreeDB({ value: rootFolder });
    }

    return { targetNote, resultBool };
}

/**
 * изменяет своиство Name в ноде дерева
 * @param rootFolder обьект IDataTreeRootFolder
 * @param target_id id компонента в котором нужно поменять Name
 * @param newValue новое значение Name
 */
async function updateNodeName(rootFolder: IDataTreeRootFolder, target_id: string, newName: string) {
    let targetNode = getNodeById(rootFolder, target_id);
    let resultBool = false;

    if ((targetNode && isDataTreeFolder(targetNode)) || isDataTreeNote(targetNode)) {
        targetNode.name = newName;
        resultBool = true;
        if (isDataTreeNote(targetNode)) {
            targetNode.lastEditTime = Date.now();
        }
        await setDataTreeDB({ value: rootFolder });
    }

    return { targetNode, resultBool };
}

/**
 * удаление компонента из заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteID id заметки
 * @param componentID id компонента который нужно удалить
 */
async function deleteComponentInNote(rootFolder: IDataTreeRootFolder, noteID: string, componentID: string) {
    const insIdGenerator = savedIdGenerator.instatnceIdGenerator;
    if (!insIdGenerator) throw new Error("IdGenerator is not defined");
    let resultBool = false;

    let targetNote = getNodeById(rootFolder, noteID);

    if (targetNote && isDataTreeNote(targetNote)) {
        targetNote.body = targetNote.body.filter((item) => {
            if (item.id === componentID) {
                insIdGenerator.deleteId(componentID);
                return false;
            }
            return true;
        });

        targetNote.lastEditTime = Date.now();
        resultBool = true;
        await setDataTreeDB({ value: rootFolder });
    }
    return { targetNote, resultBool };
}

/**
 * удаляет ноду типа TchildrenType по id из tempData в indexedDB
 * @param data - обьект сохранения IDataTreeRootFolder
 * @param target_id - id ноды которую нужно удалить
 */
async function deleteById(data: IDataTreeRootFolder, target_id: string) {
    let parent: IDataTreeFolder;
    let deletedNode: TchildrenType | undefined;
    const insIdGenerator = savedIdGenerator.instatnceIdGenerator;
    let resultBool = false;
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
            resultBool = true;
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
    await setDataTreeDB({ value: data });
    return { deletedNode, resultBool };
}

/**
 * Добавляет ноду в дерево
 * @param data - обьект сохранения IDataTreeRootFolder
 * @param insertToId - id ноды в которую нужно добавить
 * @param newNode - обьект новой ноды (классы из 0-shared/utils/saveData... .ts)
 */
async function addNodeTo(
    data: IDataTreeRootFolder,
    insertToId: string,
    newNode: TchildrenType | TNoteBody | DataNote | DataFolder
): Promise<{ newNode: null | IDataTreeFolder | IDataTreeNote | TNoteBody; resultBool: boolean }> {
    let targetNode = getNodeById(data, insertToId);
    let resultBool = false;

    if (!targetNode) return { newNode: null, resultBool };

    // в папку мы можем добавить другую папку или заметку
    if (isDataTreeFolder(targetNode) && (isDataTreeFolder(newNode) || isDataTreeNote(newNode))) {
        if (!targetNode.children) targetNode.children = [];
        targetNode.children.push(newNode);
        resultBool = true;
        await setDataTreeDB({ value: data });
        return { newNode, resultBool };
    }

    // в заметку мы можем добавить компонент
    if (isDataTreeNote(targetNode) && isDataNoteBody(newNode)) {
        targetNode.body.push(newNode);
        resultBool = true;
        await setDataTreeDB({ value: data });
        return { newNode, resultBool };
    }

    return { newNode: null, resultBool };
}

/**
 * перемещает заметку или папку в другую папку
 * @param data - обьект сохранения IDataTreeRootFolder
 * @param muvedNodeID - id ноды которую перемещаем
 * @param muveToID - id ноды куда перемещаем
 */
async function nodeMuveTo(
    data: IDataTreeRootFolder,
    muvedNodeID: string,
    muveToID: string
): Promise<{ muvedNode: IDataTreeFolder | IDataTreeNote | TNoteBody | null; resultBool: boolean }> {
    let muvedNode = getNodeById(data, muvedNodeID);
    let muvedNodeParent = muvedNode && getParentNode(data, muvedNode.id);
    let moveToNode = getNodeById(data, muveToID);
    let resultBool = false;

    if (!muvedNode || !muvedNodeParent || !moveToNode) return { muvedNode: null, resultBool };
    if (muvedNode.id === "root") return { muvedNode: muvedNode, resultBool };
    if (getNodeById(muvedNode, moveToNode.id)) return { muvedNode: muvedNode, resultBool }; // чтобы нельзя было переместить папку в ее дочернюю папку
    if (muvedNodeParent.id === moveToNode.id) return { muvedNode, resultBool }; // если, откуда = куда перемещаем то ничего не делаем
    if (moveToNode.id === muvedNodeID) return { muvedNode, resultBool }; // чтобы нельзя было перемещать элементы самих в себя

    // убераем muvedNode из дочерних элементов muvedNodeParent
    if (isDataTreeFolder(muvedNodeParent)) {
        muvedNodeParent.children = muvedNodeParent.children!.filter((element) => {
            if (element.id === muvedNode!.id) return false;
            return true;
        });
    }

    if (isDataTreeFolder(moveToNode)) {
        if (!isDataTreeFolder(muvedNode) && !isDataTreeNote(muvedNode)) return { muvedNode: null, resultBool };
        if (!moveToNode.children) moveToNode.children = [];
        moveToNode.children.push(muvedNode);
        resultBool = true;
        await setDataTreeDB({ value: data });
        return { muvedNode, resultBool };
    }

    return { muvedNode: null, resultBool };
}

/**
 * удаляет тег у заметки
 * @param data обьект IDataTreeRootFolder
 * @param targetNoteID id заметки в которой удаляем
 * @param tag обьект тега который нужно убрать
 */
async function noteDeleteTag(data: IDataTreeRootFolder, targetNoteID: string, tag: IGlobalTag) {
    let targetNote = getNodeById(data, targetNoteID);
    let resultBool = false;

    if (!targetNote) return { targetNote: null, resultBool };
    if (!isDataTreeNote(targetNote)) return { targetNote: null, resultBool };
    if (!("tags" in targetNote)) return { targetNote: null, resultBool };

    targetNote.tags = targetNote.tags!.filter((tagName) => {
        if (tagName === tag.tag_name) return false;
        return true;
    });

    targetNote.lastEditTime = Date.now();
    resultBool = true;
    await setDataTreeDB({ value: data });

    return { targetNote, resultBool };
}

/**
 * добавляет тег в заметку
 * @param data обьект IDataTreeRootFolder
 * @param targetNoteID id заметки в которую добавляем
 * @param tag имена тегов которые нужно добавить
 */
async function noteAddTag(data: IDataTreeRootFolder, targetNoteID: string, tag: string | string[]) {
    let targetNote = getNodeById(data, targetNoteID);
    const allTags = await getGlobalTagsDB();
    let prepareTags: string[] = [];
    let resultBool = false;

    if (!allTags) return { targetNote: null, resultBool };

    if (Array.isArray(tag) && tag.length > 0) {
        for (let tagItem of tag) {
            if (!(tagItem in allTags)) return { targetNote: null, resultBool };
        }
        prepareTags = [...tag];
    }

    if (typeof tag === "string" && tag !== "") {
        if (!(tag in allTags)) {
            return { targetNote: null, resultBool };
        }
        prepareTags.push(tag);
    }

    if (!targetNote) return { targetNote: null, resultBool };
    if (!isDataTreeNote(targetNote)) return { targetNote: null, resultBool };

    if (!("tags" in targetNote)) {
        targetNote.tags = [];
    }

    targetNote.tags = targetNote.tags!.concat(prepareTags);
    targetNote.lastEditTime = Date.now();

    resultBool = true;
    await setDataTreeDB({ value: data });

    return { targetNote, resultBool };
}

/**
 * добавляет тег в проект
 * @param tagData обьект
 * @param newTag - обьект нового тега (классы из 0-shared/utils/saveDataTag.ts)
 */
async function projectAddTag(tagData: IAllTags, newTag: IGlobalTag | DataTag) {
    tagData[newTag.tag_name] = newTag;

    await setGlobalTagsDB({ value: tagData });

    return newTag;
}

/**
 * удаляет тег из проекта
 * @param tagData обьект
 * @param data обьект IDataTreeRootFolder
 * @param tagName - имя тега который нужно удалить
 */
async function projectDeleteTag(tagData: IAllTags, data: IDataTreeRootFolder, tagName: string) {
    let resultBool = false;

    if (tagName in tagData) {
        delete tagData[tagName];
        const allNotes = getAllNotes(data);

        for (let note of allNotes) {
            if (!note.tags) continue;
            note.tags = note.tags.filter((tag) => {
                if (tag === tagName) return false;
                return true;
            });
        }

        // удалить этот тег из всех заметок
        resultBool = true;
        await setGlobalTagsDB({ value: tagData });
        await setDataTreeDB({ value: data });
    }

    return { tagName, resultBool };
}

/**
 * изменяет тег во всем проекте
 * @param tagData обьект
 * @param data обьект IDataTreeRootFolder
 * @param oldTagName - старое имя тега
 * @param newTagName - новое имя тега
 * @param newTagColor - новый цвет тега
 */
async function projectEditeTag(tagData: IAllTags, data: IDataTreeRootFolder, oldTagName: string, newTagName: string, newTagColor: TTagColors) {
    // так как теги в db хранятся в обьекте по (ключу = имя тега), если имя изменилось то и ключ должен изменится
    // TODO: возможно в будующем добавлю тегам id и в качестве ключа к тегу будет его id, это серьезно упростит работу с изменением тегов, + положительно скажется на визуальном отображаении. (речь идет о том как рендерится список с key в react ), ведь key равен имяни тега а значит и ключу в db
    let resultBool = false;

    if (oldTagName !== newTagName) {
        if (!(newTagName in tagData)) {
            delete tagData[oldTagName];
            tagData[newTagName] = new DataTag(newTagName, newTagColor);
            const allNotes = getAllNotes(data);

            for (let note of allNotes) {
                if (!note.tags) continue;
                const indexTagOldName = note.tags.indexOf(oldTagName);
                if (indexTagOldName !== -1) {
                    note.tags[indexTagOldName] = newTagName;
                }
            }
            resultBool = true;
            await setDataTreeDB({ value: data });
        }
    } else {
        resultBool = true;
        tagData[oldTagName].color = newTagColor;
    }

    await setGlobalTagsDB({ value: tagData });

    return { newTagName, resultBool };
}

/**
 * Добавляет новый компонент в заметку
 * @param data обьект IDataTreeRootFolder
 * @param noteId id заметки в которую нужно добавить компонент
 * @param componentType тип добавляемого компонента (заголовок, текст... короче TAllComponents)
 */
async function addNewComponentToNote(data: IDataTreeRootFolder, noteId: string, componentType: TAllComponents) {
    let updatedNote = getNodeById(data, noteId);
    let resultBool = false;

    if (updatedNote && isDataTreeNote(updatedNote)) {
        let component: TNoteBody | undefined;
        switch (componentType) {
            case "header":
                component = new DataComponentHeader();
                break;
            default:
                component = undefined;
                break;
        }

        if (component !== undefined) {
            updatedNote.lastEditTime = Date.now();
            resultBool = true;
            updatedNote.body.push(component);
            await setDataTreeDB({ value: data });
        }
    }

    return { updatedNote, resultBool };
}

export {
    //mergeNodeById,
    updateNodeValue,
    deleteComponentInNote,
    deleteById,
    updateNodeName,
    addNodeTo,
    nodeMuveTo,
    noteDeleteTag,
    noteAddTag,
    projectAddTag,
    projectDeleteTag,
    projectEditeTag,
    updateNodeCompleted,
    addNewComponentToNote,
};
