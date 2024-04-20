import type { IDataTreeRootFolder } from "0-shared/types/dataSave";
import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote } from "0-shared/utils/typeHelpers";
import { delImageDB } from "../appIndexedDBFynctions/imageFunctions";
import { delTableDB } from "../appIndexedDBFynctions/tableFunctions";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import { IdGenerator } from "0-shared/utils/idGenerator";

type TReturnTypeDeleteComponentInNote = ReturnType<typeof deleteComponentInNote>;

/**
 * удаление компонента из заметки
 * @param rootFolder обьект IDataTreeRootFolder
 * @param noteID id заметки
 * @param componentID id компонента который нужно удалить
 */
async function deleteComponentInNote(rootFolder: IDataTreeRootFolder, noteID: string, componentID: string, savedIdGenerator: string[]) {
    let newIdGenerator = new IdGenerator(new Set(savedIdGenerator));
    let resultBool = false;

    let targetNote = getNodeById(rootFolder, noteID);

    if (targetNote && isDataTreeNote(targetNote)) {
        targetNote.body = targetNote.body.filter((item) => {
            if (item.id === componentID) {
                newIdGenerator.deleteId(componentID);
                if (item.component == "image") {
                    delImageDB({ key: item.id });
                    item.value = "";
                }
                if (item.component == "table") {
                    delTableDB({ key: item.id });
                    item.value = "";
                }
                return false;
            }
            return true;
        });

        targetNote.lastEditTime = Date.now();
        resultBool = true;
        await setDataTreeDB({ value: rootFolder });
    }

    return { targetNote, resultBool, newIdGenerator: newIdGenerator.getIdsArray() };
}

export { deleteComponentInNote };
export type { TReturnTypeDeleteComponentInNote };
