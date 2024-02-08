import type { IDataTreeFolder } from "0-shared/types/dataSave";
import { savedIdGenerator } from "0-shared/utils/idGenerator";

/**
 *  класс для создания новых папок в дереве IDataTreeRootFolder
 */
class DataFolder implements IDataTreeFolder {
    public name!: IDataTreeFolder["name"];
    public color!: IDataTreeFolder["color"];
    public children?: IDataTreeFolder["children"];
    public id!: IDataTreeFolder["id"];
    public type!: IDataTreeFolder["type"];

    constructor(name: string, color: string = "") {
        const insIdGenerator = savedIdGenerator.instatnceIdGenerator;
        if (!insIdGenerator) throw new Error("IdGenerator is not defined");

        let that = Object.create(null) as IDataTreeFolder;

        that.name = name;
        that.color = color;
        that.children = [];
        that.id = insIdGenerator.generateId();
        that.type = "folder";

        return that;
    }
}

export { DataFolder };
