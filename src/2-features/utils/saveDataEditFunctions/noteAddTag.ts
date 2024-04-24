import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { getGlobalTagsDB } from "../appIndexedDBFynctions/globalTagsFunctions";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeNoteAddTag = ReturnType<typeof noteAddTag>;
type TParametersNoteAddTag = Parameters<typeof noteAddTag>;

/**
 * добавляет тег в заметку
 * @param rootFolder обьект IDataTreeRootFolder
 * @param targetNoteID id заметки в которую добавляем
 * @param tag имена тегов которые нужно добавить
 */
async function noteAddTag(data: { rootFolder: IDataTreeRootFolder; targetNoteID: string; tag: string | string[] }) {
    let targetNote = getNodeById(data.rootFolder, data.targetNoteID);
    const allTags = await getGlobalTagsDB();
    let prepareTags: string[] = [];
    let resultBool = false;

    if (!allTags) return { targetNote: null, resultBool };

    if (Array.isArray(data.tag) && data.tag.length > 0) {
        for (let tagItem of data.tag) {
            if (!(tagItem in allTags)) return { targetNote: null, resultBool };
        }
        prepareTags = [...data.tag];
    }

    if (typeof data.tag === "string" && data.tag !== "") {
        if (!(data.tag in allTags)) {
            return { targetNote: null, resultBool };
        }
        prepareTags.push(data.tag);
    }

    if (!targetNote) return { targetNote: null, resultBool };
    if (!isDataTreeNote(targetNote)) return { targetNote: null, resultBool };

    if (!("tags" in targetNote)) {
        targetNote.tags = [];
    }

    targetNote.tags = targetNote.tags!.concat(prepareTags);
    targetNote.lastEditTime = Date.now();

    resultBool = true;
    await setDataTreeDB({ value: data.rootFolder });

    return { targetNote, resultBool };
}

export { noteAddTag };
export type { TReturnTypeNoteAddTag, TParametersNoteAddTag };
