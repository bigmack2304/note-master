import type { IGlobalTag, TTagColors } from "0-shared/types/dataSave";

/**
 *  класс для создания новых тегов для IAllTags
 */
class DataTag implements IGlobalTag {
    public tag_name!: IGlobalTag["tag_name"];
    public color!: IGlobalTag["color"];

    constructor(name: string, color: TTagColors) {
        let that = Object.create(null) as IGlobalTag;

        that.tag_name = name;
        that.color = color;

        return that;
    }
}

export { DataTag };
