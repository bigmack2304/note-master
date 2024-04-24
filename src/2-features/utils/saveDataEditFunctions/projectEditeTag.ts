import { getAllNotes } from "../saveDataParse";
import { DataTag } from "0-shared/utils/classes/saveDataTag";
import { setDataTreeDB } from "../appIndexedDBFynctions/dataTreeDb";
import { setGlobalTagsDB } from "../appIndexedDBFynctions/globalTagsFunctions";
import type { IAllTags, IDataTreeRootFolder, TTagColors } from "0-shared/types/dataSave";

type TReturnTypeProjectEditeTag = ReturnType<typeof projectEditeTag>;
type TParametersProjectEditeTag = Parameters<typeof projectEditeTag>;

/**
 * изменяет тег во всем проекте
 * @param tagData обьект
 * @param data обьект IDataTreeRootFolder
 * @param oldTagName - старое имя тега
 * @param newTagName - новое имя тега
 * @param newTagColor - новый цвет тега
 */
async function projectEditeTag(data: {
    tagData: IAllTags;
    rootFolder: IDataTreeRootFolder;
    oldTagName: string;
    newTagName: string;
    newTagColor: TTagColors;
}) {
    // так как теги в db хранятся в обьекте по (ключу = имя тега), если имя изменилось то и ключ должен изменится
    // TODO: возможно в будующем добавлю тегам id и в качестве ключа к тегу будет его id, это серьезно упростит работу с изменением тегов, + положительно скажется на визуальном отображаении. (речь идет о том как рендерится список с key в react ), ведь key равен имяни тега а значит и ключу в db
    let resultBool = false;

    if (data.oldTagName !== data.newTagName) {
        if (!(data.newTagName in data.tagData)) {
            delete data.tagData[data.oldTagName];
            data.tagData[data.newTagName] = new DataTag(data.newTagName, data.newTagColor);
            const allNotes = getAllNotes(data.rootFolder);

            for (let note of allNotes) {
                if (!note.tags) continue;
                const indexTagOldName = note.tags.indexOf(data.oldTagName);
                if (indexTagOldName !== -1) {
                    note.tags[indexTagOldName] = data.newTagName;
                }
            }
            resultBool = true;
            await setDataTreeDB({ value: data.rootFolder });
        }
    } else {
        resultBool = true;
        data.tagData[data.oldTagName].color = data.newTagColor;
    }

    await setGlobalTagsDB({ value: data.tagData });

    return { newTagName: data.newTagName, resultBool };
}

export { projectEditeTag };
export type { TReturnTypeProjectEditeTag, TParametersProjectEditeTag };
