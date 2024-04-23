import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeUpdateNoteComponentImageSettings = ReturnType<typeof updateNoteComponentImageSettings>;

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

export { updateNoteComponentImageSettings };
export type { TReturnTypeUpdateNoteComponentImageSettings };
