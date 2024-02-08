import { DataNode } from "./saveDataNode";
import type { IDataTreeFolder, TchildrenType, TNodeType } from "0-shared/types/dataSave";

/**
 *  класс для создания новых папок в дереве IDataTreeRootFolder
 */
class DataFolder extends DataNode implements IDataTreeFolder {
    public name: string;
    public color: string;
    public children: TchildrenType[];

    constructor(name: string, color: string = "") {
        super("folder");

        this.name = name;
        this.color = color;
        this.children = [];
    }
}

export { DataFolder };
