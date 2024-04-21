import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { delTableDB, setTableDB } from "../appIndexedDBFynctions/tableFunctions";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { TTableValue } from "0-shared/types/dataSave";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeUpdateNodeTable = ReturnType<typeof updateNodeTable>;

/**
 * изменяет компонент таблицы в заметке
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param newValue новое значение TTableValue
 * @returns
 */
async function updateNodeTable(rootFolder: IDataTreeRootFolder, noteId: string, componentId: string, newValue: TTableValue | "") {
    let targetNote = getNodeById(rootFolder, noteId);
    let resultBool = false;

    // TODO: потом нужно это оптимизировать
    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== componentId) continue;
            if (component.component === "table") {
                if (newValue === "") {
                    component.value = "";
                    delTableDB({ key: componentId });
                } else {
                    component.value = componentId;
                    setTableDB({
                        value: {
                            id: componentId,
                            value: newValue,
                        },
                        key: componentId,
                    });
                }
            }
            break;
        }

        targetNote.lastEditTime = Date.now();
        resultBool = true;
        await setDataTreeDB({ value: rootFolder });
    }

    return { targetNote, resultBool };
}

export { updateNodeTable };
export type { TReturnTypeUpdateNodeTable };
