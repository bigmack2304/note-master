import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { DataComponentHeader } from "0-shared/utils/classes/saveDataComponentHeader";
import { saveDataComponentText } from "0-shared/utils/classes/saveDataComponentText";
import { saveDataComponentCode } from "0-shared/utils/classes/saveDataComponentCode";
import { saveDataComponentImage } from "0-shared/utils/classes/saveDataComponentImage";
import { saveDataComponentLink } from "0-shared/utils/classes/saveDataComponentLink";
import { saveDataComponentVideo } from "0-shared/utils/classes/saveDataComponentVideo";
import { DataComponentList } from "0-shared/utils/classes/saveDataComponentList";
import { saveDataComponentTable } from "0-shared/utils/classes/saveDataComponentTable";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import { IdGenerator } from "0-shared/utils/idGenerator";
import type { IDataTreeRootFolder, TAllComponents, TNoteBody } from "0-shared/types/dataSave";
import { getNodeById } from "../saveDataParseFunctions/getNodeById";

type TReturnTypeAddNewComponentToNote = ReturnType<typeof addNewComponentToNote>;
type TParametersAddNewComponentToNote = Parameters<typeof addNewComponentToNote>;

/**
 * Добавляет новый компонент в заметку
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которую нужно добавить компонент
 * @param componentType тип добавляемого компонента (заголовок, текст... короче TAllComponents)
 */
async function addNewComponentToNote(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentType: TAllComponents;
    savedIdGenerator: string[];
}) {
    let resultBool = false;
    let newIdGenerator = new IdGenerator(new Set(data.savedIdGenerator));
    let updatedNote = getNodeById(data.rootFolder, data.noteId);

    if (updatedNote && isDataTreeNote(updatedNote)) {
        let component: TNoteBody | undefined;
        switch (data.componentType) {
            case "header":
                component = new DataComponentHeader(newIdGenerator);
                break;
            case "text":
                component = new saveDataComponentText(newIdGenerator);
                break;
            case "code":
                component = new saveDataComponentCode(newIdGenerator);
                break;
            case "image":
                component = new saveDataComponentImage(newIdGenerator);
                break;
            case "link":
                component = new saveDataComponentLink(newIdGenerator);
                break;
            case "video":
                component = new saveDataComponentVideo(newIdGenerator);
                break;
            case "list":
                component = new DataComponentList(newIdGenerator);
                break;
            case "table":
                component = new saveDataComponentTable(newIdGenerator);
                break;
            default:
                component = undefined;
                break;
        }

        if (component !== undefined) {
            updatedNote.lastEditTime = Date.now();
            resultBool = true;
            updatedNote.body.push(component);
            await setDataTreeDB({ value: data.rootFolder });
        }
    }

    return { updatedNote, resultBool, newIdGenerator: newIdGenerator.getIdsArray() };
}

export { addNewComponentToNote };
export type { TReturnTypeAddNewComponentToNote, TParametersAddNewComponentToNote };
