import type { TBodyComponentTable, TTableValue } from "0-shared/types/dataSave";
import { DataNode } from "./saveDataNode";

/**
 *  значение пустой таблицы. (для db и компонента таблицы)
 */
const tableValue_preset_default: TTableValue = {
    headers: [],
    rows: [],
};

/**
 *  значение пустой таблицы. (для db и компонента таблицы)
 */
const TableValue_preset_2x1: TTableValue = {
    headers: [
        { colIndex: 0, value: "" },
        { colIndex: 1, value: "" },
    ],
    rows: [
        {
            rowIndex: 0,
            value: [
                { colIndex: 0, value: "" },
                { colIndex: 1, value: "" },
            ],
        },
    ],
};

/**
 *  класс для создания новых компонентов таблицы заметки
 */
class saveDataComponentTable extends DataNode implements TBodyComponentTable {
    public component: TBodyComponentTable["component"];
    public value: TBodyComponentTable["value"];
    public desc: TBodyComponentTable["desc"];
    public viewButtons: TBodyComponentTable["viewButtons"];
    public backlight: TBodyComponentTable["backlight"];
    public aligin: TBodyComponentTable["aligin"];

    constructor() {
        super("component");

        this.component = "table";
        this.value = "";
        this.desc = "";
        this.backlight = true;
        this.viewButtons = false;
        this.aligin = "left";

        Object.setPrototypeOf(this, null);
    }
}

export { saveDataComponentTable, tableValue_preset_default, TableValue_preset_2x1 };
