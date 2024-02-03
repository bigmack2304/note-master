import type { IDataTreeitemBody, TchildrenType, IDataTreeNote, IDataTreeFolder, TNoteBody } from "0-shared/types/dataSave";
import { getTempDataDB, setTempDataDB } from "./appIndexedDB";
import type { IDataSave } from "0-shared/types/dataSave";
import { isDataTreeNote, isDataTreeFolder } from "0-shared/utils/typeHelpers";

//TODO: тут потом нужно будет прощитать все возможности обьеденения
// обновляет temp данные в indexedDB

// обновление существующих данных внутри заметок
async function updateNotesTempData(newValue: IDataTreeitemBody | TchildrenType) {
    let target_id = newValue.id; // получаем id измененного элемента
    let currentData: IDataSave | undefined;
    // получаем все дерево из дб
    await getTempDataDB({
        callback: (value) => {
            currentData = value;
        },
    });

    const merger = (children: TchildrenType[]) => {
        // если внутреннее дерево отсутствует
        if (!children || children.length === 0) return;
        for (let node of children) {
            if (isDataTreeNote(node)) {
                if (node.id === target_id) {
                    Object.assign(node, newValue);
                }
            }
            if (isDataTreeFolder(node)) {
                if (node.children && children.length !== 0) {
                    merger(node.children);
                }
            }
        }
    };

    if (currentData && currentData.data_tree.children && currentData.data_tree.children.length !== 0) {
        merger(currentData.data_tree.children);
    }

    if (!currentData || !currentData.data_tree.children || currentData.data_tree.children.length === 0) return;
    setTempDataDB({ value: currentData });
}

export { updateNotesTempData };
