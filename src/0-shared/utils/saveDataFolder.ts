import type { IDataTreeFolder } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  класс для создания новых папок в дереве IDataTreeRootFolder
 */
class DataFolder extends DataNode implements IDataTreeFolder {
    public name: IDataTreeFolder["name"];
    public color: IDataTreeFolder["color"];
    public children?: IDataTreeFolder["children"];

    constructor(name: string, color: string = "") {
        super("folder");

        this.name = name;
        this.color = color;
        this.children = [];

        Object.setPrototypeOf(this, null);
    }
}

export { DataFolder };
