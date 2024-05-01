import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder, TBodyComponentText } from "0-shared/types/dataSave";

type TReturnTypeUpdateNoteComponentTextSettings = ReturnType<typeof updateNoteComponentTextSettings>;
type TParametersUpdateNoteComponentTextSettings = Parameters<typeof updateNoteComponentTextSettings>;

/**
 * изменяет настройки компонента текста в обьекте заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param textBackground значение фона для текста
 * @param textFormat нужноли форматировать текст
 * @param fontValue тип шрифта для текста
 * @param lineBreak автоматический перенос строк
 */
async function updateNoteComponentTextSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    textBackground: boolean;
    textFormat: boolean;
    fontValue: TBodyComponentText["font"];
    lineBreak: boolean;
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "text") {
                component.background = data.textBackground;
                component.font = data.fontValue;
                component.formatting = data.textFormat;
                component.lineBreak = data.lineBreak;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

export { updateNoteComponentTextSettings };
export type { TReturnTypeUpdateNoteComponentTextSettings, TParametersUpdateNoteComponentTextSettings };
