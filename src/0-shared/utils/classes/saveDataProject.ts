import type { IDataSave } from "0-shared/types/dataSave";

/**
 *  класс для создания проекта
 */
class DataProject implements IDataSave {
    public db_type: IDataSave["db_type"];
    public global_tags: IDataSave["global_tags"];
    public data_tree: IDataSave["data_tree"];
    public data_images: IDataSave["data_images"];

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
        this.data_images = {};

        Object.setPrototypeOf(this, null);
    }
}

export { DataProject };
