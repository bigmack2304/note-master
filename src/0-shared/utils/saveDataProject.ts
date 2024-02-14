import type { IDataSave } from "0-shared/types/dataSave";
import { savedIdGenerator } from "0-shared/utils/idGenerator";

/**
 *  класс для создания новых папок в дереве IDataTreeRootFolder
 */
class DataProject implements IDataSave {
    public db_type: IDataSave["db_type"];
    public global_tags: IDataSave["global_tags"];
    public data_tree: IDataSave["data_tree"];

    constructor() {
        this.db_type = "note_Master";
        this.global_tags = {};
        this.data_tree = {
            name: "root",
            id: "root",
            color: "",
            type: "folder",
            children: [],
        };

        Object.setPrototypeOf(this, null);
    }
}

export { DataProject };
