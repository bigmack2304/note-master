import type { TBodyComponentText } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  класс для создания новых папок в дереве IDataTreeRootFolder
 */
class saveDataComponentText extends DataNode implements TBodyComponentText {
    public component: TBodyComponentText["component"];
    public value: TBodyComponentText["value"];

    constructor() {
        super("component");

        this.component = "text";
        this.value = "";

        Object.setPrototypeOf(this, null);
    }
}

export { saveDataComponentText };
