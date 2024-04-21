import { getParentNode, getAllNotes } from "./saveDataParse";
import { getNodeById } from "./saveDataParseFunctions/getNodeById";
import { setGlobalTagsDB, getGlobalTagsDB } from "./appIndexedDB";
import { setDataTreeDB } from "./appIndexedDBFynctions/dataTreeDb";
import { setTableDB, delTableDB } from "./appIndexedDBFynctions/tableFunctions";
import { delImageDB, setImageDB } from "./appIndexedDBFynctions/imageFunctions";
import { moveElement } from "0-shared/utils/arrayFunctions";
import { isDataTreeFolder, isDataTreeNote, isDataNoteBody } from "0-shared/utils/typeHelpers";
import { savedIdGenerator } from "0-shared/utils/idGenerator";
import { DataTag } from "0-shared/utils/classes/saveDataTag";
import { DataComponentHeader } from "0-shared/utils/classes/saveDataComponentHeader";
import { saveDataComponentText } from "0-shared/utils/classes/saveDataComponentText";
import { saveDataComponentCode } from "0-shared/utils/classes/saveDataComponentCode";
import { saveDataComponentImage } from "0-shared/utils/classes/saveDataComponentImage";
import { saveDataComponentLink } from "0-shared/utils/classes/saveDataComponentLink";
import { saveDataComponentVideo } from "0-shared/utils/classes/saveDataComponentVideo";
import { saveDataComponentTable } from "0-shared/utils/classes/saveDataComponentTable";
import { DataComponentList } from "0-shared/utils/classes/saveDataComponentList";
import type {
    TchildrenType,
    TNoteBody,
    IDataTreeFolder,
    IDataTreeNote,
    IDataTreeRootFolder,
    IGlobalTag,
    IAllTags,
    TTagColors,
    TAllComponents,
    TBodyComponentText,
    TBodyComponentHeader,
    TBodyComponentCode,
    TBodyComponentLink,
    TBodyComponentVideo,
    TBodyComponentList,
    TBodyComponentTable,
    TTableValue,
} from "0-shared/types/dataSave";
import type { DataNote } from "0-shared/utils/classes/saveDataNote";
import type { DataFolder } from "0-shared/utils/classes/saveDataFolder";
// функции для применения изменений к tempData в indexedDB

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
 * изменяет настройки компонента image в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняются данные
 * @param imageDesc новое описание
 * @param isDescHidden нужноли скрыть описание
 */
async function updateNoteComponentImageSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    imageDesc: string;
    isDescHidden: boolean;
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "image") {
                component.desc = data.imageDesc;
                component.isDescHidden = data.isDescHidden;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

/**
 * изменяет настройки компонента текста в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param textBackground значение фона для текста
 * @param textFormat нужноли форматировать текст
 * @param fontValue тип шрифта для текста
 * @param lineBreak автоматический перенос строк
 */
async function updateNoteComponentTextSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    textBackground: boolean;
    textFormat: boolean;
    fontValue: TBodyComponentText["font"];
    lineBreak: boolean;
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "text") {
                component.background = data.textBackground;
                component.font = data.fontValue;
                component.formatting = data.textFormat;
                component.lineBreak = data.lineBreak;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

/**
 * изменяет настройки компонента списка в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param listBg значение фона для списка
 * @param isNumeric установить номеруемый тип
 */
async function updateNoteComponentListSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    listBg: TBodyComponentList["background"];
    isNumeric: TBodyComponentList["isNumeric"];
    aligin: TBodyComponentList["textAligin"];
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "list") {
                component.background = data.listBg;
                component.isNumeric = data.isNumeric;
                component.textAligin = data.aligin;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

/**
 * изменяет настройки компонента заголовка в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param textAligin выравнивание текста
 * @param headerSize размер заголовка
 */
async function updateNoteComponentHeaderSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    textAligin: TBodyComponentHeader["textAligin"];
    headerSize: TBodyComponentHeader["headerSize"];
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "header") {
                component.headerSize = data.headerSize;
                component.textAligin = data.textAligin;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

/**
 * изменяет настройки компонента кода в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param codeTheme цветовая тема кода
 * @param codeLanguage язык кода (для подцветки синтаксиса)
 */
async function updateNoteComponentCodeSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    codeTheme: TBodyComponentCode["codeTheme"];
    codeLanguage: TBodyComponentCode["language"];
    isExpand: TBodyComponentCode["isExpand"];
    expandDesc: TBodyComponentCode["expandDesc"];
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "code") {
                component.codeTheme = data.codeTheme;
                component.language = data.codeLanguage;
                component.isExpand = data.isExpand;
                component.expandDesc = data.expandDesc;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

/**
 * изменяет своиство Name в ноде дерева
 * @param rootFolder обьект IDataTreeRootFolder
 * @param target_id id компонента в котором нужно поменять Name
 * @param newName новое значение Name
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
async function projectEditeTag(
    tagData: IAllTags,
    data: IDataTreeRootFolder,
    oldTagName: string,
    newTagName: string,
    newTagColor: TTagColors
) {
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
            case "text":
                component = new saveDataComponentText();
                break;
            case "code":
                component = new saveDataComponentCode();
                break;
            case "image":
                component = new saveDataComponentImage();
                break;
            case "link":
                component = new saveDataComponentLink();
                break;
            case "video":
                component = new saveDataComponentVideo();
                break;
            case "list":
                component = new DataComponentList();
                break;
            case "table":
                component = new saveDataComponentTable();
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
    updateNoteComponentTextSettings,
    updateNoteComponentHeaderSettings,
    updateNoteComponentCodeSettings,
    updateNoteComponentImageSettings,
    updateNoteComponentListSettings,
};
