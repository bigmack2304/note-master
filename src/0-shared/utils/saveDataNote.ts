import type { IDataTreeNote } from "0-shared/types/dataSave";
import { savedIdGenerator } from "0-shared/utils/idGenerator";

/**
 *  класс для создания новых заметок в дереве IDataTreeRootFolder
 */
class DataNote implements IDataTreeNote {
    public name!: IDataTreeNote["name"];
    public tags?: IDataTreeNote["tags"];
    public body!: IDataTreeNote["body"];
    public id!: IDataTreeNote["id"];
    public type!: IDataTreeNote["type"];

    constructor(name: string, tags: string[] | string) {
        const insIdGenerator = savedIdGenerator.instatnceIdGenerator;
        if (!insIdGenerator) throw new Error("IdGenerator is not defined");

        let that = Object.create(null) as IDataTreeNote;

        let prepareTags: string[] = [];

        if (tags && Array.isArray(tags)) {
            prepareTags = [...tags];
        }

        if (tags && typeof tags === "string" && tags !== "") {
            prepareTags.push(tags);
        }

        that.name = name;
        that.tags = prepareTags;
        that.body = [];
        that.id = insIdGenerator.generateId();
        that.type = "note";

        return that;
    }
}

export { DataNote };
