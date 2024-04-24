import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import type { IDataTreeRootFolder, TchildrenType, TNoteBody, IDataTreeFolder, IDataTreeNote } from "0-shared/types/dataSave";

/**
 * ищет родителя ноды. Родителем может быть как папка (для других папок или заметок) так и заметка (для компонентов)
 * @param rootNode обект типа IDataTreeRootFolder | TchildrenType | TNoteBody
 * @param nodeId id ноды для которой нужно отыскать родителя
 */
function getParentNode(
    rootNode: IDataTreeRootFolder | TchildrenType | TNoteBody,
    nodeId: string
): IDataTreeNote | IDataTreeFolder | TNoteBody | null | undefined {
    type TTreeElement = IDataTreeNote | IDataTreeFolder | TNoteBody;

    let parent: IDataTreeNote | IDataTreeFolder | IDataTreeRootFolder | TNoteBody;

    parent = rootNode;

    let result: TTreeElement | null | undefined;

    const finder = (node: TTreeElement): TTreeElement | null | undefined => {
        if (node.id === nodeId) {
            if (node.id === parent.id) return undefined;
            return parent as TTreeElement;
        }

        if (isDataTreeFolder(node)) {
            if (node.children) {
                let saveParent = parent;
                parent = node;
                for (let child of node.children) {
                    let finder_result = finder(child);
                    if (finder_result === undefined) return null;
                    if (finder_result) return finder_result;
                }
                parent = saveParent;
            }
            return null;
        }

        if (isDataTreeNote(node)) {
            let saveParent = parent;
            parent = node;
            for (let component of node.body) {
                let finder_result = finder(component);
                if (finder_result === undefined) return null;
                if (finder_result) return finder_result;
            }
            parent = saveParent;
        }

        return null;
    };

    result = finder(parent);
    return result;
}

export { getParentNode };
