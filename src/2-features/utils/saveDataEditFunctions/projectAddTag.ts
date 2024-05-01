import { setGlobalTagsDB } from "../appIndexedDBFynctions/globalTagsFunctions";
import type { IAllTags, IGlobalTag } from "0-shared/types/dataSave";
import type { DataTag } from "0-shared/utils/classes/saveDataTag";

/**
 * добавляет тег в проект
 * @param tagData обьект
 * @param newTag - обьект нового тега (классы из 0-shared/utils/saveDataTag.ts)
 */
async function projectAddTag(tagData: IAllTags, newTag: IGlobalTag | DataTag) {
    tagData[newTag.tag_name] = newTag;

    await setGlobalTagsDB({ value: tagData });

    return newTag;
}

export { projectAddTag };
