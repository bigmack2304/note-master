import { DataNode } from "./saveDataNode";
import type { IDataTreeNote } from "0-shared/types/dataSave";

/**
 *  класс для создания новых заметок в дереве IDataTreeRootFolder
 */
class DataNote extends DataNode implements IDataTreeNote {
    public name: IDataTreeNote["name"];
    public tags?: IDataTreeNote["tags"];
    public body: IDataTreeNote["body"];
    public createTime: IDataTreeNote["createTime"];
    public lastEditTime: IDataTreeNote["lastEditTime"];
    public completed: IDataTreeNote["completed"];

    constructor(name: string, tags: string[] | string) {
        super("note");

        let prepareTags: string[] = [];
        if (Array.isArray(tags)) {
            prepareTags = [...tags];
        } else if (typeof tags === "string" && tags !== "") {
            prepareTags.push(tags);
        }

        this.body = [];
        this.name = name;
        this.tags = prepareTags;
        this.createTime = Date.now();
        this.lastEditTime = Date.now();
        this.completed = false;

        Object.setPrototypeOf(this, null);
    }
}

export { DataNote };
