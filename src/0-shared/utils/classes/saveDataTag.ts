import type { IGlobalTag, TTagColors } from "0-shared/types/dataSave";

/**
 *  класс для создания новых тегов для IAllTags
 */
class DataTag implements IGlobalTag {
    public tag_name: IGlobalTag["tag_name"];
    public color: IGlobalTag["color"];

    constructor(name: string, color: TTagColors) {
        this.tag_name = name;
        this.color = color;

        Object.setPrototypeOf(this, null);
    }
}

export { DataTag };
