import { DataNode } from "./saveDataNode";
import { IdGenerator } from "../idGenerator";
import type { TBodyComponentVideo } from "0-shared/types/dataSave";

/**
 *  класс для создания новых компонентов кода заметки
 */
class saveDataComponentVideo extends DataNode implements TBodyComponentVideo {
    public component: TBodyComponentVideo["component"];
    public value: TBodyComponentVideo["value"];

    constructor(idGenerator: InstanceType<typeof IdGenerator>) {
        super("component", idGenerator);

        this.component = "video";
        this.value = "";

        Object.setPrototypeOf(this, null);
    }
}

export { saveDataComponentVideo };
