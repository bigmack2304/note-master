import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { getTableDB } from "2-features/utils/appIndexedDBFynctions/tableFunctions";
import type { IFindNodeParametres } from "5-app/GlobalState/toolBarStore";
import type { IDataTreeRootFolder, IDataTreeFolder, IDataTreeNote } from "0-shared/types/dataSave";

type TReturnTypeCloneFiltredTree = ReturnType<typeof cloneFiltredTree>;
type TParametersCloneFiltredTree = Parameters<typeof cloneFiltredTree>;

/**
 *  функционал для поиска заметок
 *  клонирование исходного дерева с учетом параметров поиска, ненужные ноды игнорируются для клонирования,
 *  если в ходе фильтрации появляются пустые папки они также игнорируются.
 * @param orig_obj обьект data_tree (содеращий все дерево заметок)
 * @param filtres обьект с параметрами поиска
 * @returns [клонированный обьект, Set всех id папок которые есть в клон.обьекте]
 */
async function cloneFiltredTree(
    orig_obj: IDataTreeRootFolder,
    filtres: IFindNodeParametres | undefined
): Promise<[clonedObj: IDataTreeFolder, internalFoldersId: Set<string>]> {
    let clonedObj = { ...orig_obj, children: [] } as IDataTreeFolder;
    let internalFoldersId: Set<string> = new Set<string>();

    if (!filtres) return [orig_obj, internalFoldersId];

    clonedObj = (await deepClone(orig_obj, clonedObj, filtres, internalFoldersId)) ?? orig_obj;
    return [clonedObj, internalFoldersId];
}

/**
 * непосредственно функция клонирования
 */
async function deepClone(
    origNode: IDataTreeFolder,
    clonedObj: IDataTreeFolder,
    filtres: IFindNodeParametres,
    internalFoldersId: Set<string>
) {
    if (clonedObj.id === "root") !internalFoldersId.has(clonedObj.id) && internalFoldersId.add(clonedObj.id);

    for (let child of (origNode as IDataTreeFolder)["children"]!) {
        if (isDataTreeNote(child) && (await checkFilter(child, filtres))) {
            !internalFoldersId.has(origNode.id) && internalFoldersId.add(origNode.id);
            const cloneNote = structuredClone(child);
            clonedObj["children"]!.push(cloneNote);
            continue;
        }

        if (isDataTreeFolder(child)) {
            if (child.children && child.children.length > 0) {
                const copyChildNode = { ...child, children: [] } as IDataTreeFolder;
                let innderFolder = await deepClone(child, copyChildNode, filtres, internalFoldersId);
                if (innderFolder.children && innderFolder.children.length > 0) {
                    clonedObj["children"]!.push(innderFolder);
                    !internalFoldersId.has(innderFolder.id) && internalFoldersId.add(innderFolder.id);
                }
            }
        }
    }

    return clonedObj;
}

/**
 * ф.ция проверяет соответствует-ли заметка требуемым параметрам поиска
 */
async function checkFilter(note: IDataTreeNote, filtres: IFindNodeParametres) {
    let resultName = false;
    let resultTags = false;
    let resultContent = false;

    if (filtres.name !== "") {
        if (note.name.includes(filtres.name)) resultName = true;
    } else {
        resultName = true;
    }

    if (filtres.tags.length > 0) {
        if (filtres.tags.length > 0 && (!note.tags || (note.tags && note.tags.length === 0))) resultTags = false;
        if (filtres.tags.length > 0 && note.tags && note.tags.length > 0) {
            let included: string[] = [];
            for (let findTag of filtres.tags) {
                if (note.tags.includes(findTag)) included.push(findTag);
            }
            if (included.length === filtres.tags.length) resultTags = true;
        }
    } else {
        resultTags = true;
    }

    if (filtres.content !== "") {
        for (let component of note.body) {
            if (component.value.includes(filtres.content)) return true;

            if (component.component == "link") {
                return component.isLabel && component.labelValue.includes(filtres.content);
            }

            if (component.component == "code") {
                return component.isExpand && component.expandDesc.includes(filtres.content);
            }

            if (component.component == "image") {
                return !component.isDescHidden && component.desc.includes(filtres.content);
            }

            // TODO: для поиска по содержимому таблицы придется реальзовать всю логику через промисы, поэтому пока отложим
            if (component.component == "table") {
                if (component.desc && component.desc.includes(filtres.content)) return true;

                if (component.value !== "") {
                    const tableData = await getTableDB({ key: component.value });
                    if (tableData && tableData.value) {
                        const JSONTableData = JSON.stringify(tableData.value);
                        return JSONTableData.includes(filtres.content);
                    }
                }
            }
        }
    } else {
        resultContent = true;
    }

    return resultName && resultTags && resultContent;
}

export { cloneFiltredTree };
export type { TReturnTypeCloneFiltredTree, TParametersCloneFiltredTree };
