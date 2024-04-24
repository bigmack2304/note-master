import { getAllNotes } from "../saveDataParse";
import { setGlobalTagsDB } from "../appIndexedDBFynctions/globalTagsFunctions";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import type { IDataTreeRootFolder, IAllTags } from "0-shared/types/dataSave";

type TReturnTypeProjectDeleteTag = ReturnType<typeof projectDeleteTag>;
type TParametersProjectDeleteTag = Parameters<typeof projectDeleteTag>;

/**
 * удаляет тег из проекта
 * @param tagData обьект
 * @param rootFolder обьект IDataTreeRootFolder
 * @param tagName - имя тега который нужно удалить
 */
async function projectDeleteTag(data: { tagData: IAllTags; rootFolder: IDataTreeRootFolder; tagName: string }) {
    let resultBool = false;

    if (data.tagName in data.tagData) {
        delete data.tagData[data.tagName];
        const allNotes = getAllNotes(data.rootFolder);

        for (let note of allNotes) {
            if (!note.tags) continue;
            note.tags = note.tags.filter((tag) => {
                if (tag === data.tagName) return false;
                return true;
            });
        }

        // удалить этот тег из всех заметок
        resultBool = true;
        await setGlobalTagsDB({ value: data.tagData });
        await setDataTreeDB({ value: data.rootFolder });
    }

    return { tagName: data.tagName, resultBool };
}

export { projectDeleteTag };
export type { TReturnTypeProjectDeleteTag, TParametersProjectDeleteTag };
