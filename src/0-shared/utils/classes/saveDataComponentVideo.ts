import type { TBodyComponentVideo } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  класс для создания новых компонентов кода заметки
 */
class saveDataComponentVideo extends DataNode implements TBodyComponentVideo {
    public component: TBodyComponentVideo["component"];
    public value: TBodyComponentVideo["value"];

    constructor() {
        super("component");

        this.component = "video";
        this.value = "";

        Object.setPrototypeOf(this, null);
    }
}

export { saveDataComponentVideo };
