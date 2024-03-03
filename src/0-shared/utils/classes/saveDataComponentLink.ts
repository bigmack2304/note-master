import type { TBodyComponentLink } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  класс для создания новых компонентов ссылок заметки
 */
class saveDataComponentLink extends DataNode implements TBodyComponentLink {
    public component: TBodyComponentLink["component"];
    public value: TBodyComponentLink["value"];
    public labelValue: TBodyComponentLink["labelValue"];
    public isLabel: TBodyComponentLink["isLabel"];
    public background: TBodyComponentLink["background"];
    public target: TBodyComponentLink["target"];

    constructor() {
        super("component");

        this.component = "link";
        this.value = "#";
        this.labelValue = "Link";
        this.isLabel = false;
        this.background = false;
        this.target = "web";

        Object.setPrototypeOf(this, null);
    }
}

export { saveDataComponentLink };
