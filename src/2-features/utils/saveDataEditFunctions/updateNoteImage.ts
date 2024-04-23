import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { setImageDB } from "../appIndexedDBFynctions/imageFunctions";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeUpdateNodeImage = ReturnType<typeof updateNodeImage>;
type TParametersUpdateNodeImage = Parameters<typeof updateNodeImage>;

/**
 * изменяет компонент картинки в заметке
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteId id заметки в которой редактируем компонент
 * @param componentId id компонента в котором меняется value
 * @param newValue новое значение value
 * @returns
 */
async function updateNodeImage(data: {
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    newSrc: string;
    newName: string;
}) {
    let targetNote = getNodeById(data.rootFolder, data.noteId);
    let resultBool = false;

    // TODO: потом нужно это оптимизировать
    if (targetNote && isDataTreeNote(targetNote)) {
        for (let component of targetNote.body) {
            if (component.id !== data.componentId) continue;
            if (component.component === "image") {
                component.fileName = data.newName;

                if (data.newSrc === "") {
                    component.value = "";
                    component.desc = "";
                } else {
                    component.value = component.id;
                }
                setImageDB({
                    value: {
                        id: data.componentId,
                        src: data.newSrc,
                    },
                    key: component.id,
                });
            }
            break;
        }

        targetNote.lastEditTime = Date.now();
        resultBool = true;
        await setDataTreeDB({ value: data.rootFolder });
    }

    return { targetNote, resultBool };
}

export { updateNodeImage };
export type { TReturnTypeUpdateNodeImage, TParametersUpdateNodeImage };
