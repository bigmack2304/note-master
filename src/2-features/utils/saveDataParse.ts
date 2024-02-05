import type { IDataSave, IDataTreeFolder, IDataTreeNote, TNoteBody, TchildrenType } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";

// функции для поиска разлиных элементов в tempData в indexedDB

/**
 * сбор всех ID из tempData в indexedDB
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

export { getAllIds, getNodeById };
