import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import type { IDataTreeRootFolder, TBodyComponentHeader } from "0-shared/types/dataSave";

type TReturnTypeUpdateNoteComponentHeaderSettings = ReturnType<typeof updateNoteComponentHeaderSettings>;
type TParametersUpdateNoteComponentHeaderSettings = Parameters<typeof updateNoteComponentHeaderSettings>;

/**
 * изменяет настройки компонента заголовка в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param textAligin выравнивание текста
 * @param headerSize размер заголовка
 */
async function updateNoteComponentHeaderSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    textAligin: TBodyComponentHeader["textAligin"];
    headerSize: TBodyComponentHeader["headerSize"];
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "header") {
                component.headerSize = data.headerSize;
                component.textAligin = data.textAligin;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

export { updateNoteComponentHeaderSettings };
export type { TReturnTypeUpdateNoteComponentHeaderSettings, TParametersUpdateNoteComponentHeaderSettings };
