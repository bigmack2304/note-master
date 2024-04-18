import { isDataTreeFolder, isDataTreeNote, isDataSave } from "0-shared/utils/typeHelpers";
import { nodeWithoutChildren } from "./saveDataUtils";
import type { IDataTreeFolder, IDataTreeNote, TNoteBody, TchildrenType, IDataTreeRootFolder, IDataSave } from "0-shared/types/dataSave";

// функции для поиска разлиных элементов в tempData в indexedDB

/**
 * сбор всех ID из IDataTreeRootFolder
 * @param data обьект сохранения IDataTreeRootFolder
 * @returns
 */
function getAllIds(data: IDataTreeRootFolder | IDataSave) {
    const allIds = new Set<string>();

    const parser = (node: IDataTreeFolder | IDataTreeNote | TNoteBody) => {
        if (allIds.has(node.id)) throw new Error("Duplicate id in tempData");
        allIds.add(node.id);

        if (isDataTreeFolder(node) && node.children) {
            for (let item of node.children) {
                parser(item);
            }
        }

        if (isDataTreeNote(node)) {
            for (let item of node.body) {
                parser(item);
            }
        }
    };

    parser(isDataSave(data) ? data.data_tree : data);

    return allIds;
}

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

/**
 * возвращает все папки внутри data, на любой вложенности
 * @param data обьект сохранения IDataTreeRootFolder
 * @returns
 */
function getAllFolders(data: IDataTreeRootFolder) {
    const allFolders: IDataTreeFolder[] = [];

    const parser = (node: IDataTreeFolder | IDataTreeNote | TNoteBody) => {
        if (isDataTreeFolder(node)) {
            allFolders.push(nodeWithoutChildren(node) as IDataTreeFolder);

            if (!node.children) return;
            for (let item of node.children) {
                parser(item);
            }
        }
    };

    parser(data);

    return allFolders;
}

/**
 * возвращает все заметки внутри data, на любой вложенности
 * @param data обьект сохранения IDataTreeRootFolder
 * @returns
 */
function getAllNotes(data: IDataTreeRootFolder) {
    const allNotes: IDataTreeNote[] = [];

    const parser = (node: IDataTreeFolder | IDataTreeNote | TNoteBody) => {
        if (isDataTreeFolder(node)) {
            if (!node.children) return;
            for (let item of node.children) {
                parser(item);
            }
        }

        if (isDataTreeNote(node)) {
            allNotes.push(node);
        }
    };

    parser(data);

    return allNotes;
}

/**
 * ищет родительскую папку для ноды
 * @param rootNode обект типа IDataTreeRootFolder | TchildrenType
 * @param nodeId id ноды для которой нужно отыскать родителя
 */
function getParentFolder(rootNode: IDataTreeFolder, nodeId: string): IDataTreeNote | IDataTreeFolder | TNoteBody | null | undefined {
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

        return null;
    };

    result = finder(parent);

    return result;
}

export { getAllIds, getNodeById, getParentNode, getAllFolders, getAllNotes, getParentFolder };
