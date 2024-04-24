import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeUpdateNodeValue = ReturnType<typeof updateNodeValue>;
type TParametersUpdateNodeValue = Parameters<typeof updateNodeValue>;

/**
 * изменяет своиство value в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param newValue новое значение value
 * @returns
 */
async function updateNodeValue(data: { rootFolder: IDataTreeRootFolder; noteId: string; componentId: string; newValue: string }) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    // TODO: потом нужно это оптимизировать
    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            component.value = data.newValue;
            break;
        }

        targetNote.lastEditTime = Date.now();
        resultBool = true;
        await setDataTreeDB({ value: data.rootFolder });
    }

    return { targetNote, resultBool };
}

export { updateNodeValue };
export type { TReturnTypeUpdateNodeValue, TParametersUpdateNodeValue };
