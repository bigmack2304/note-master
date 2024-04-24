import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder, TBodyComponentList } from "0-shared/types/dataSave";

type TReturnTypeUpdateNoteComponentListSettings = ReturnType<typeof updateNoteComponentListSettings>;
type TParametersUpdateNoteComponentListSettings = Parameters<typeof updateNoteComponentListSettings>;

/**
 * изменяет настройки компонента списка в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param listBg значение фона для списка
 * @param isNumeric установить номеруемый тип
 */
async function updateNoteComponentListSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    listBg: TBodyComponentList["background"];
    isNumeric: TBodyComponentList["isNumeric"];
    aligin: TBodyComponentList["textAligin"];
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "list") {
                component.background = data.listBg;
                component.isNumeric = data.isNumeric;
                component.textAligin = data.aligin;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

export { updateNoteComponentListSettings };
export type { TReturnTypeUpdateNoteComponentListSettings, TParametersUpdateNoteComponentListSettings };
