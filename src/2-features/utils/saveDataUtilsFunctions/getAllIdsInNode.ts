import type { IDataTreeFolder, IDataTreeNote, TNoteBody } from "0-shared/types/dataSave";

/**
 * возвращает массив всех вложенных id внутри Node
 * @param node обьект типа IDataTreeFolder | IDataTreeNote внутри которого нужно собрать id
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

export { getAllIdsInNode };
