import type { TBodyComponentCode } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  класс для создания новых компонентов кода заметки
 */
class saveDataComponentCode extends DataNode implements TBodyComponentCode {
    public component: TBodyComponentCode["component"];
    public value: TBodyComponentCode["value"];
    public language: TBodyComponentCode["language"];
    public codeTheme: TBodyComponentCode["codeTheme"];

    constructor() {
        super("component");

        this.component = "code";
        this.value = "";
        this.language = "text";
        this.codeTheme = "auto";

        Object.setPrototypeOf(this, null);
    }
}

export { saveDataComponentCode };
