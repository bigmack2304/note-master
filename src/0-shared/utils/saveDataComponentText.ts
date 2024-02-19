import type { TBodyComponentText } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  класс для создания новых компонентов текста заметки
 */
class saveDataComponentText extends DataNode implements TBodyComponentText {
    public component: TBodyComponentText["component"];
    public value: TBodyComponentText["value"];
    public background: TBodyComponentText["background"];
    public formatting: TBodyComponentText["formatting"];
    public font: TBodyComponentText["font"];
    public lineBreak: TBodyComponentText["lineBreak"];

    constructor() {
        super("component");

        this.component = "text";
        this.value = "";
        this.background = false;
        this.font = "default";
        this.formatting = true;
        this.lineBreak = true;

        Object.setPrototypeOf(this, null);
    }
}

export { saveDataComponentText };
