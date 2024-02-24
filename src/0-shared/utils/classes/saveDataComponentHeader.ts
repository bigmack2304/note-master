import type { TBodyComponentHeader } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  класс для создания новых компонентов заголовка заметки
 */
class DataComponentHeader extends DataNode implements TBodyComponentHeader {
    public component: TBodyComponentHeader["component"];
    public value: TBodyComponentHeader["value"];
    public headerSize: TBodyComponentHeader["headerSize"];
    public textAligin: TBodyComponentHeader["textAligin"];

    constructor() {
        super("component");

        this.component = "header";
        this.value = "";
        this.headerSize = "h3";
        this.textAligin = "center";

        Object.setPrototypeOf(this, null);
    }
}

export { DataComponentHeader };
