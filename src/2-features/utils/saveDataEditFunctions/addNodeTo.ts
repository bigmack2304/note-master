import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeFolder, isDataTreeNote, isDataNoteBody } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { DataFolder } from "0-shared/utils/classes/saveDataFolder";
import type { DataNote } from "0-shared/utils/classes/saveDataNote";
import type { IDataTreeRootFolder, TchildrenType, TNoteBody, IDataTreeFolder, IDataTreeNote } from "0-shared/types/dataSave";

type TReturnTypeAddNodeTo = ReturnType<typeof addNodeTo>;
type TParametersAddNodeTo = Parameters<typeof addNodeTo>;

/**
 * Добавляет ноду в дерево
 * @param rootFolder - обьект сохранения IDataTreeRootFolder
 * @param insertToId - id ноды в которую нужно добавить
 * @param newNode - обьект новой ноды (классы из 0-shared/utils/saveData... .ts)
 */
async function addNodeTo(data: {
    rootFolder: IDataTreeRootFolder;
    insertToId: string;
    newNode: TchildrenType | TNoteBody | DataNote | DataFolder;
}): Promise<{ newNode: null | IDataTreeFolder | IDataTreeNote | TNoteBody; resultBool: boolean }> {
    let targetNode = getNodeById(data.rootFolder, data.insertToId);
    let resultBool = false;

    if (!targetNode) return { newNode: null, resultBool };

    // в папку мы можем добавить другую папку или заметку
    if (isDataTreeFolder(targetNode) && (isDataTreeFolder(data.newNode) || isDataTreeNote(data.newNode))) {
        if (!targetNode.children) targetNode.children = [];
        targetNode.children.push(data.newNode);
        resultBool = true;
        await setDataTreeDB({ value: data.rootFolder });
        return { newNode: data.newNode, resultBool };
    }

    // в заметку мы можем добавить компонент
    if (isDataTreeNote(targetNode) && isDataNoteBody(data.newNode)) {
        targetNode.body.push(data.newNode);
        resultBool = true;
        await setDataTreeDB({ value: data.rootFolder });
        return { newNode: data.newNode, resultBool };
    }

    return { newNode: null, resultBool };
}

export { addNodeTo };
export type { TReturnTypeAddNodeTo, TParametersAddNodeTo };
