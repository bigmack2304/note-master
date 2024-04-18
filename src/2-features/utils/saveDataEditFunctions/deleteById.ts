import { IdGenerator } from "0-shared/utils/idGenerator";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { getAllIdsInNode } from "../saveDataUtilsFunctions/getAllIdsInNode";
import { delImageDB } from "../appIndexedDBFynctions/imageFunctions";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import { delTableDB } from "../appIndexedDBFynctions/tableFunctions";
import type { IDataTreeRootFolder, IDataTreeFolder, TchildrenType } from "0-shared/types/dataSave";

/**
 * удаляет ноду типа TchildrenType по id из tempData в indexedDB
 * @param data - обьект сохранения IDataTreeRootFolder
 * @param target_id - id ноды которую нужно удалить
 * @param savedIdGenerator - результат вызова savedIdGenerator.instatnceIdGenerator.getIdsArray()
 */
type TReturnTypeDeleteById = ReturnType<typeof deleteById>;

async function deleteById(data: IDataTreeRootFolder, target_id: string, savedIdGenerator: string[]) {
    let parent: IDataTreeFolder;
    let deletedNode: TchildrenType | undefined;
    let resultBool = false;
    let newIdGenerator = new IdGenerator(new Set(savedIdGenerator));

    const finder = (node: TchildrenType) => {
        if (node.id === target_id && node.id !== "root") {
            parent.children = parent.children!.filter((child) => {
                if (child.id === target_id) {
                    if (isDataTreeFolder(child) || isDataTreeNote(child)) {
                        const innerIds = getAllIdsInNode(child);
                        delImageDB({ key: innerIds });
                        delTableDB({ key: innerIds });
                        innerIds.map((id) => {
                            newIdGenerator.deleteId(id);
                        });
                    }
                    newIdGenerator.deleteId(target_id);
                    deletedNode = child;
                    return false;
                }
                return true;
            });
            resultBool = true;
            return true;
        }

        if (isDataTreeFolder(node)) {
            if (node.children) {
                let temp = parent;
                parent = node;
                for (let child of node.children) {
                    let result = finder(child);
                    if (result) return true;
                }
                parent = temp;
            }
        }
    };

    parent = data;
    let result = finder(data);
    if (!result) throw new Error(`node not found`);
    await setDataTreeDB({ value: data });
    return { deletedNode, resultBool, newIdGenerator: newIdGenerator.getIdsArray() };
}

export { deleteById };
export type { TReturnTypeDeleteById };
