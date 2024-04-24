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
import { runTaskOnWorker } from "0-shared/dedicatedWorker/workerFuncs";
import { workerRef } from "0-shared/dedicatedWorker/workerInit";
import type { IDataTreeRootFolder, TAllComponents, TNoteBody } from "0-shared/types/dataSave";
import type { TMessageGetNodeByIdOnWorker } from "0-shared/dedicatedWorker/workerTypes";
import type { TReturnTypeGetNodeById } from "../saveDataParseFunctions/getNodeById";

/**
 * Добавляет новый компонент в заметку
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которую нужно добавить компонент
 * @param componentType тип добавляемого компонента (заголовок, текст... короче TAllComponents)
 */
async function addNewComponentToNote(data: { rootFolder: IDataTreeRootFolder; noteId: string; componentType: TAllComponents }) {
    let resultBool = false;
    const worker = workerRef.DWorker;
    if (!worker) return { updatedNote: undefined, resultBool };

    let updatedNote = await runTaskOnWorker<TMessageGetNodeByIdOnWorker, TReturnTypeGetNodeById>(worker, {
        type: "get node by id",
        args: [data.rootFolder, data.noteId],
    });

    if (updatedNote && isDataTreeNote(updatedNote)) {
        let component: TNoteBody | undefined;
        switch (data.componentType) {
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
            await setDataTreeDB({ value: data.rootFolder });
        }
    }

    return { updatedNote, resultBool };
}

export { addNewComponentToNote };
