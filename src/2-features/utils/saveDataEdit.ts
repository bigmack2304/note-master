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

export { projectAddTag, addNewComponentToNote };
