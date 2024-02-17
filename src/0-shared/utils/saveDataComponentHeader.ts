import type { TBodyComponentHeader } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  класс для создания новых папок в дереве IDataTreeRootFolder
 */
class DataComponentHeader extends DataNode implements TBodyComponentHeader {
    public component: TBodyComponentHeader["component"];
    public value: TBodyComponentHeader["value"];

    constructor() {
        super("component");

        this.component = "header";
        this.value = "";

        Object.setPrototypeOf(this, null);
    }
}

export { DataComponentHeader };
