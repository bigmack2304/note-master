import type { IDataSave, IDataTreeFolder, IDataTreeNote, TNoteBody, TchildrenType, IDataTreeRootFolder } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";

// функции для поиска разлиных элементов в tempData в indexedDB

/**
 * сбор всех ID из IDataSave
 * @param data обьект сохранения IDataSave
 * @returns
 */
function getAllIds(data: IDataSave) {
    const allIds = new Set<string>();
    const { data_tree } = data;

    const parser = (node: IDataTreeFolder | IDataTreeNote | TNoteBody) => {
        for (let elem in node) {
            if (elem === "id") {
                if (allIds.has(node[elem])) throw new Error("Duplicate id in tempData");
                allIds.add(node[elem]);
                continue;
            }
            if (elem === "children") {
                for (let item of (node as IDataTreeFolder)[elem]!) {
                    parser(item);
                }
            }
            if (elem === "body") {
                for (let item of (node as IDataTreeNote)[elem]) {
                    parser(item);
                }
            }
        }
    };

    parser(data_tree);

    return allIds;
}

/**
 * возвращает массив всех вложенных id внутри Node
 * @param folder обьект типа IDataTreeFolder | IDataTreeNote
 */
function getAllIdsInNode(node: IDataTreeFolder | IDataTreeNote) {
    const allIds = new Set<string>();

    const parser = (node: IDataTreeFolder | IDataTreeNote | TNoteBody) => {
        for (let prop in node) {
            if (prop === "id") {
                if (allIds.has(node[prop])) throw new Error("Duplicate id in tempData");
                allIds.add(node[prop]);
                continue;
            }
            if (prop === "children") {
                for (let item of (node as IDataTreeFolder)[prop]!) {
                    parser(item);
                }
            }
            if (prop === "body") {
                for (let item of (node as IDataTreeNote)[prop]) {
                    parser(item);
                }
            }
        }
    };

    parser(node);
    return Array.from(allIds);
}

/**
 * ищет ноду по заданному id и возвращает ее
 * @param rootNode обект типа IDataSave | TchildrenType | TNoteBody | undefined
 * @param find_id искомый ID
 * @returns
 */
function getNodeById(rootNode: IDataSave | TchildrenType | TNoteBody | undefined, find_id: string) {
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
        if ("data_tree" in root) root = root.data_tree;
        return finder(root as TchildrenType | TNoteBody);
    }

    return null;
}

/**
 * ищет родителя ноды.
 * @param rootNode обект типа IDataSave | TchildrenType | TNoteBody
 * @param nodeId id ноды для которой нужно отыскать родителя
 */
function getParentNode(rootNode: IDataSave | TchildrenType | TNoteBody, nodeId: string): IDataTreeNote | IDataTreeFolder | TNoteBody | null {
    type TTreeElement = IDataTreeNote | IDataTreeFolder | TNoteBody;

    let parent: IDataTreeNote | IDataTreeFolder | IDataTreeRootFolder | undefined;

    if ("data_tree" in rootNode) parent = rootNode.data_tree;
    if ("children" in rootNode) parent = rootNode;
    if ("body" in rootNode) parent = rootNode;
    if (!parent) return null;

    let result: TTreeElement | null;

    const finder = (node: TTreeElement): TTreeElement | null => {
        if (node.id === nodeId) {
            return parent as TTreeElement;
        }

        if (isDataTreeFolder(node)) {
            if (node.children) {
                let saveParent = parent;
                parent = node;
                for (let child of node.children) {
                    let finder_result = finder(child);
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
                if (finder_result) return finder_result;
            }
            parent = saveParent;
        }

        return null;
    };

    result = finder(parent);
    return result;
}

export { getAllIds, getNodeById, getAllIdsInNode, getParentNode };
