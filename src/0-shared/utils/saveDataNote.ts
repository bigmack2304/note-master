import { DataNode } from "./saveDataNode";
import type { IDataTreeNote, TNoteBody, TNodeType } from "0-shared/types/dataSave";

/**
 *  класс для создания новых заметок в дереве IDataTreeRootFolder
 */
class DataNote extends DataNode implements IDataTreeNote {
    public name: string;
    public tags: string[];
    public body: TNoteBody[];

    constructor(name: string, tags?: string[]) {
        super("note");

        this.name = name;
        this.tags = tags || [];
        this.body = [];
    }
}

export { DataNote };
