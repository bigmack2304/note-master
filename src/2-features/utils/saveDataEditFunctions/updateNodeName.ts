import { getNodeById } from "../saveDataParseFunctions/getNodeById";
import { isDataTreeNote, isDataTreeFolder } from "0-shared/utils/typeHelpers";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder } from "0-shared/types/dataSave";

type TReturnTypeUpdateNodeName = ReturnType<typeof updateNodeName>;
type TParametersUpdateNodeName = Parameters<typeof updateNodeName>;

/**
 * изменяет своиство Name в ноде дерева
 * @param rootFolder обьект IDataTreeRootFolder
 * @param target_id id компонента в котором нужно поменять Name
 * @param newName новое значение Name
 */
async function updateNodeName(data: { rootFolder: IDataTreeRootFolder; target_id: string; newName: string }) {
    let targetNode = getNodeById(data.rootFolder, data.target_id);
    let resultBool = false;

    if ((targetNode && isDataTreeFolder(targetNode)) || isDataTreeNote(targetNode)) {
        targetNode.name = data.newName;
        resultBool = true;
        if (isDataTreeNote(targetNode)) {
            targetNode.lastEditTime = Date.now();
        }
        await setDataTreeDB({ value: data.rootFolder });
    }

    return { targetNode, resultBool };
}

export { updateNodeName };
export type { TReturnTypeUpdateNodeName, TParametersUpdateNodeName };
