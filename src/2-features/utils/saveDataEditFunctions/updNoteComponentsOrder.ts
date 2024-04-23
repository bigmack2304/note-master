import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { moveElement } from "0-shared/utils/arrayFunctions";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeUpdNoteComponentsOrder = ReturnType<typeof updNoteComponentsOrder>;
type TParametersUpdNoteComponentsOrder = Parameters<typeof updNoteComponentsOrder>;

/**
 * меняет порядок компонентов в заметке
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой меняем компоненты местами
 * @param componentDragId id компонента который двигаем
 * @param toComponentDragId id компонента на место которого поставим "componentDragId"
 */
async function updNoteComponentsOrder(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentDragId: string;
    toComponentDragId: string;
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    if (targetNote && isDataTreeNote(targetNote)) {
        let dragComponentIndex: number | null = null;
        let toComponentIndex: number | null = null;

        for (let i = 0; i < targetNote.body.length; i++) {
            if (dragComponentIndex && toComponentIndex) {
                break;
            }
            if (targetNote.body[i].id === data.componentDragId) {
                dragComponentIndex = i;
                continue;
            }
            if (targetNote.body[i].id === data.toComponentDragId) {
                toComponentIndex = i;
                continue;
            }
        }

        if (dragComponentIndex !== null && toComponentIndex !== null) {
            targetNote.body = moveElement(targetNote.body, dragComponentIndex, toComponentIndex);
        }

        targetNote.lastEditTime = Date.now();
        resultBool = true;
        await setDataTreeDB({ value: data.rootFolder });
    }

    return { targetNote, resultBool };
}

export { updNoteComponentsOrder };
export type { TReturnTypeUpdNoteComponentsOrder, TParametersUpdNoteComponentsOrder };
