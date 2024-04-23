import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder, TBodyComponentLink } from "0-shared/types/dataSave";

type TReturnTypeUpdateNoteComponentLinkSettings = ReturnType<typeof updateNoteComponentLinkSettings>;
type TParametersUpdateNoteComponentLinkSettings = Parameters<typeof updateNoteComponentLinkSettings>;

/**
 * изменяет настройки компонента ссылки в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняются данные
 * @param isLabel новое значение isLabel
 * @param isBg новое значение isBg
 * @param labelVal новое значение labelVal
 */
async function updateNoteComponentLinkSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    isLabel: TBodyComponentLink["isLabel"];
    isBg: TBodyComponentLink["background"];
    labelVal: TBodyComponentLink["labelValue"];
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "link") {
                component.background = data.isBg;
                component.isLabel = data.isLabel;
                component.labelValue = data.labelVal;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

export { updateNoteComponentLinkSettings };
export type { TReturnTypeUpdateNoteComponentLinkSettings, TParametersUpdateNoteComponentLinkSettings };
