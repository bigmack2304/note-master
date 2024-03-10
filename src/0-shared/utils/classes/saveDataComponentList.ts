import type { TBodyComponentList } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  класс для создания новых компонентов заголовка заметки
 */
class DataComponentList extends DataNode implements TBodyComponentList {
    public component: TBodyComponentList["component"];
    public value: TBodyComponentList["value"];
    public background: TBodyComponentList["background"];
    public isNumeric: TBodyComponentList["isNumeric"];
    public textAligin: TBodyComponentList["textAligin"];

    constructor() {
        super("component");

        this.component = "list";
        this.value = "";
        this.background = false;
        this.isNumeric = false;
        this.textAligin = "left";

        Object.setPrototypeOf(this, null);
    }
}

export { DataComponentList };
