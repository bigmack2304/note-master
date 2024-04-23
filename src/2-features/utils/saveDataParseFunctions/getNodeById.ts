import type { IDataTreeRootFolder, TchildrenType, TNoteBody } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import type { TupleToObject } from "0-shared/utils/typeHelpers";

type TReturnTypeGetNodeById = ReturnType<typeof getNodeById>;
type TParametersGetNodeById = Parameters<typeof getNodeById>;

/**
 * ищет ноду по заданному id и возвращает ее
 * @param rootNode обект типа IDataTreeRootFolder | TchildrenType | TNoteBody | undefined
 * @param find_id искомый ID
 * @returns
 */
function getNodeById(rootNode: IDataTreeRootFolder | TchildrenType | TNoteBody | undefined, find_id: string) {
    const finder = (node: TchildrenType | TNoteBody): TchildrenType | TNoteBody | null => {
        if (node.id === find_id) {
            return node;
        }

        if (isDataTreeFolder(node)) {
            if (node.children) {
                for (let child of node.children) {
                    let result = finder(child);
                    if (result) return result;
                }
            }
        }

        if (isDataTreeNote(node)) {
            for (let component of node.body) {
                if (component.id === find_id) {
                    return component;
                }
            }
        }

        return null;
    };

    if (rootNode) {
        let root = rootNode;
        return finder(root as TchildrenType | TNoteBody);
    }

    return null;
}

export { getNodeById };
export type { TReturnTypeGetNodeById, TParametersGetNodeById };
