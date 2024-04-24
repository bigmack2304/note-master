import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeUpdateNodeCompleted = ReturnType<typeof updateNodeCompleted>;
type TParametersUpdateNodeCompleted = Parameters<typeof updateNodeCompleted>;

/**
 * изменяет своиство completed в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой нужно поменять completed
 * @param newValue новое значение completed
 * @returns
 */
async function updateNodeCompleted(data: { rootFolder: IDataTreeRootFolder; noteId: string; newValue: boolean }) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        if (targetNote.completed !== data.newValue) {
            targetNote.completed = data.newValue;
            resultBool = true;
            targetNote.lastEditTime = Date.now();
            await setDataTreeDB({ value: data.rootFolder });
        }
        resultBool = true;
    }

    return { targetNote, resultBool };
}

export { updateNodeCompleted };
export type { TParametersUpdateNodeCompleted, TReturnTypeUpdateNodeCompleted };
