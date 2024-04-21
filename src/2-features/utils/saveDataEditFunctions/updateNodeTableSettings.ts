import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import type { TBodyComponentTable, IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeUpdateNodeTableSettings = ReturnType<typeof updateNodeTableSettings>;

/**
 * изменяет настройки компонента таблицы в заметке
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param backlight подцветка строк
 * @param desc описание таблицы
 * @param viewButtons элементы управления в режиме просмотра
 * @returns
 */
async function updateNodeTableSettings(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    backlight: TBodyComponentTable["backlight"];
    desc: TBodyComponentTable["desc"];
    viewButtons: TBodyComponentTable["viewButtons"];
    aligin: TBodyComponentTable["aligin"];
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "table") {
                component.backlight = data.backlight;
                component.desc = data.desc;
                component.viewButtons = data.viewButtons;
                component.aligin = data.aligin;

                targetNote.lastEditTime = Date.now();
                resultBool = true;
                await setDataTreeDB({ value: data.rootFolder });
                break;
            }
        }
    }

    return { targetNote, resultBool };
}

export { updateNodeTableSettings };
export type { TReturnTypeUpdateNodeTableSettings };
