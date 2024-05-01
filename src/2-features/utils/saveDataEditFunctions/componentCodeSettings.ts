import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder, TBodyComponentCode } from "0-shared/types/dataSave";

type TReturnTypeUpdateNoteComponentCodeSettings = ReturnType<typeof updateNoteComponentCodeSettings>;
type TParametersUpdateNoteComponentCodeSettings = Parameters<typeof updateNoteComponentCodeSettings>;

/**
 * изменяет настройки компонента кода в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param codeTheme цветовая тема кода
 * @param codeLanguage язык кода (для подцветки синтаксиса)
 */
async function updateNoteComponentCodeSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    codeTheme: TBodyComponentCode["codeTheme"];
    codeLanguage: TBodyComponentCode["language"];
    isExpand: TBodyComponentCode["isExpand"];
    expandDesc: TBodyComponentCode["expandDesc"];
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "code") {
                component.codeTheme = data.codeTheme;
                component.language = data.codeLanguage;
                component.isExpand = data.isExpand;
                component.expandDesc = data.expandDesc;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

export { updateNoteComponentCodeSettings };
export type { TReturnTypeUpdateNoteComponentCodeSettings, TParametersUpdateNoteComponentCodeSettings };
