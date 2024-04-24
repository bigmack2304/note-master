import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import { getParentNode } from "../saveDataParseFunctions/getParentNode";
import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import type { IDataTreeRootFolder, IDataTreeFolder, IDataTreeNote, TNoteBody } from "0-shared/types/dataSave";

type TReturnTypeNodeMuveTo = ReturnType<typeof nodeMuveTo>;
type TParametersNodeMuveTo = Parameters<typeof nodeMuveTo>;

/**
 * перемещает заметку или папку в другую папку
 * @param data - обьект сохранения IDataTreeRootFolder
 * @param muvedNodeID - id ноды которую перемещаем
 * @param muveToID - id ноды куда перемещаем
 */
async function nodeMuveTo(data: {
    rootFolder: IDataTreeRootFolder;
    muvedNodeID: string;
    muveToID: string;
}): Promise<{ muvedNode: IDataTreeFolder | IDataTreeNote | TNoteBody | null; resultBool: boolean }> {
    let muvedNode = getNodeById(data.rootFolder, data.muvedNodeID);
    let muvedNodeParent = muvedNode && getParentNode(data.rootFolder, muvedNode.id);
    let moveToNode = getNodeById(data.rootFolder, data.muveToID);
    let resultBool = false;

    if (!muvedNode || !muvedNodeParent || !moveToNode) return { muvedNode: null, resultBool };
    if (muvedNode.id === "root") return { muvedNode: muvedNode, resultBool };
    if (getNodeById(muvedNode, moveToNode.id)) return { muvedNode: muvedNode, resultBool }; // чтобы нельзя было переместить папку в ее дочернюю папку
    if (muvedNodeParent.id === moveToNode.id) return { muvedNode, resultBool }; // если, откуда = куда перемещаем то ничего не делаем
    if (moveToNode.id === data.muvedNodeID) return { muvedNode, resultBool }; // чтобы нельзя было перемещать элементы самих в себя

    // убераем muvedNode из дочерних элементов muvedNodeParent
    if (isDataTreeFolder(muvedNodeParent)) {
        muvedNodeParent.children = muvedNodeParent.children!.filter((element) => {
            if (element.id === muvedNode!.id) return false;
            return true;
        });
    }

    if (isDataTreeFolder(moveToNode)) {
        if (!isDataTreeFolder(muvedNode) && !isDataTreeNote(muvedNode)) return { muvedNode: null, resultBool };
        if (!moveToNode.children) moveToNode.children = [];
        moveToNode.children.push(muvedNode);
        resultBool = true;
        await setDataTreeDB({ value: data.rootFolder });
        return { muvedNode, resultBool };
    }

    return { muvedNode: null, resultBool };
}

export { nodeMuveTo };
export type { TReturnTypeNodeMuveTo, TParametersNodeMuveTo };
