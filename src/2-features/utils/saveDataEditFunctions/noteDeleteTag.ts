import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder, IGlobalTag } from "0-shared/types/dataSave";

type TReturnTypeNoteDeleteTag = ReturnType<typeof noteDeleteTag>;
type TParametersNoteDeleteTag = Parameters<typeof noteDeleteTag>;

/**
 * удаляет тег у заметки
 * @param data обьект IDataTreeRootFolder
 * @param targetNoteID id заметки в которой удаляем
 * @param tag обьект тега который нужно убрать
 */
async function noteDeleteTag(data: { rootFolder: IDataTreeRootFolder; targetNoteID: string; tag: IGlobalTag }) {
    let targetNote = getNodeById(data.rootFolder, data.targetNoteID);
    let resultBool = false;

    if (!targetNote) return { targetNote: null, resultBool };
    if (!isDataTreeNote(targetNote)) return { targetNote: null, resultBool };
    if (!("tags" in targetNote)) return { targetNote: null, resultBool };

    targetNote.tags = targetNote.tags!.filter((tagName) => {
        if (tagName === data.tag.tag_name) return false;
        return true;
    });

    targetNote.lastEditTime = Date.now();
    resultBool = true;
    await setDataTreeDB({ value: data.rootFolder });

    return { targetNote, resultBool };
}

export { noteDeleteTag };
export type { TReturnTypeNoteDeleteTag, TParametersNoteDeleteTag };
