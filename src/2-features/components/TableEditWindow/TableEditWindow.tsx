import React, { useState } from "react";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";
import "./TableEditWindow.scss";
import { TTableValue } from "0-shared/types/dataSave";
import { TableValue_preset_2x1 } from "0-shared/utils/classes/saveDataComponentTable";
import { Table } from "../Table/Table";
import type { TBodyComponentTable } from "0-shared/types/dataSave";

type TTableEditWindowProps = {
    addClassNames?: string[];
    backLight?: TBodyComponentTable["backlight"];
    onClose?: (isChange: boolean, tableValue: TTableValue) => void;
    tableData: TTableValue | null;
    isOpen: boolean;
};

/**
 * кнопка, показывающая диалоговое окно с возможностью добавить новый тег в проект
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function TableEditWindow({ addClassNames = [], isOpen, tableData, onClose, backLight }: TTableEditWindowProps) {
    const [isChange, setIsChange] = useState(false);
    const [tableValue, setTableValue] = useState<TTableValue>(TableValue_preset_2x1);
    const defaultClassName = "TableEditWindow";
    let genClassName = "";

    const calcClassName = () => {
        let tempClassname = defaultClassName.split(" ").concat(addClassNames);

        genClassName = tempClassname.join(" ");
    };

    const onDialogClose = () => {
        onClose && onClose(isChange, tableValue);
    };

    const onTableSave = (newValue: TTableValue) => {
        setIsChange(true);
        setTableValue(newValue);
    };

    calcClassName();
    return (
        <>
            <DialogWindow addClassNames={[genClassName]} headerText="Редактирование таблицы" isOpen={isOpen} onClose={onDialogClose}>
                <Table tableRenderData={tableData ?? TableValue_preset_2x1} editMode={true} onSave={onTableSave} backLight={backLight} />
            </DialogWindow>
        </>
    );
}

export { TableEditWindow };
