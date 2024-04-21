import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import type { IDataTreeRootFolder, TBodyComponentLink } from "0-shared/types/dataSave";

type TReturnTypeUpdateNodeLink = ReturnType<typeof updateNodeLink>;

/**
 * изменяет компонент ссылки в заметке
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param target новое значение target
 * @param value новое значение value
 */
async function updateNodeLink(
    rootFolder: IDataTreeRootFolder,
    noteId: string,
    componentId: string,
    target: TBodyComponentLink["target"],
    value: TBodyComponentLink["value"]
) {
    let targetNote = getNodeById(rootFolder, noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== componentId) continue;
            if (component.component === "link") {
                component.target = target;
                component.value = value;
            }
            break;
        }

        targetNote.lastEditTime = Date.now();
        resultBool = true;
        await setDataTreeDB({ value: rootFolder });
    }

    return { targetNote, resultBool };
}

export { updateNodeLink };
export type { TReturnTypeUpdateNodeLink };
