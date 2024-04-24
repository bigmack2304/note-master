import { getAllNotes } from "./saveDataParse";
import { getParentNode } from "./saveDataParseFunctions/getParentNode";
import { getNodeById } from "./saveDataParseFunctions/getNodeById";
import { setGlobalTagsDB } from "./appIndexedDBFynctions/globalTagsFunctions";
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

export { projectAddTag, projectEditeTag, addNewComponentToNote };
