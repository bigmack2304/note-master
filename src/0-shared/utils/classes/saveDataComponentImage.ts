import { DataNode } from "./saveDataNode";
import { IdGenerator } from "../idGenerator";
import type { TBodyComponentImage } from "0-shared/types/dataSave";

/**
 *  класс для создания новых компонентов картинки заметки
 */
class saveDataComponentImage extends DataNode implements TBodyComponentImage {
    public component: TBodyComponentImage["component"];
    public value: TBodyComponentImage["value"];
    public desc: TBodyComponentImage["desc"];
    public isDescHidden: TBodyComponentImage["isDescHidden"];
    public fileName: TBodyComponentImage["fileName"];

    constructor(idGenerator: InstanceType<typeof IdGenerator>) {
        super("component", idGenerator);

        this.component = "image";
        this.value = "";
        this.desc = "";
        this.isDescHidden = false;
        this.fileName = "";

        Object.setPrototypeOf(this, null);
    }
}

export { saveDataComponentImage };
