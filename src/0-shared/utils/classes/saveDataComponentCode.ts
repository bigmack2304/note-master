import { DataNode } from "./saveDataNode";
import { IdGenerator } from "../idGenerator";
import type { TBodyComponentCode } from "0-shared/types/dataSave";

/**
 *  класс для создания новых компонентов кода заметки
 */
class saveDataComponentCode extends DataNode implements TBodyComponentCode {
    public component: TBodyComponentCode["component"];
    public value: TBodyComponentCode["value"];
    public language: TBodyComponentCode["language"];
    public codeTheme: TBodyComponentCode["codeTheme"];
    public isExpand: TBodyComponentCode["isExpand"];
    public expandDesc: TBodyComponentCode["expandDesc"];

    constructor(idGenerator: InstanceType<typeof IdGenerator>) {
        super("component", idGenerator);

        this.component = "code";
        this.value = "";
        this.language = "text";
        this.codeTheme = "auto";
        this.isExpand = false;
        this.expandDesc = "";

        Object.setPrototypeOf(this, null);
    }
}

export { saveDataComponentCode };
