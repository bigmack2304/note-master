import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { delTableDB, setTableDB } from "../appIndexedDBFynctions/tableFunctions";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { TTableValue } from "0-shared/types/dataSave";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeUpdateNodeTable = ReturnType<typeof updateNodeTable>;
type TParametersUpdateNodeTable = Parameters<typeof updateNodeTable>;

/**
 * изменяет компонент таблицы в заметке
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param newValue новое значение TTableValue
 * @returns
 */
async function updateNodeTable(data: { rootFolder: IDataTreeRootFolder; noteId: string; componentId: string; newValue: TTableValue | "" }) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    // TODO: потом нужно это оптимизировать
    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "table") {
                if (data.newValue === "") {
                    component.value = "";
                    delTableDB({ key: data.componentId });
                } else {
                    component.value = data.componentId;
                    setTableDB({
                        value: {
                            id: data.componentId,
                            value: data.newValue,
                        },
                        key: data.componentId,
                    });
                }
            }
            break;
        }

        targetNote.lastEditTime = Date.now();
        resultBool = true;
        await setDataTreeDB({ value: data.rootFolder });
    }

    return { targetNote, resultBool };
}

export { updateNodeTable };
export type { TReturnTypeUpdateNodeTable, TParametersUpdateNodeTable };
