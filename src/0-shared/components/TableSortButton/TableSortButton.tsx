import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { SxProps } from "@mui/material";
import { deep_object_is_equal } from "0-shared/utils/is_equal";
import "./TableSortButton.scss";

type TTableSortButtonProps = {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
    icon?: "top" | "bottom";
    isActive?: boolean;
    dataSet?: { name: string; value: string }[];
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * кнопка для сортировки элементов в таблице (стрелка, вверх или в низ)
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop size - размер иконки
 * @prop title - текст описания при наведении
 * @prop icon - тип иконки для отображения
 * @prop isActive - если false то иконка будет полупрозрачной
 * @prop dataSet - data атрибуты
 */
function TableSortButton({ onClick = () => {}, addClassNames = [], title, size = "inherit", icon = "top", isActive = false, dataSet }: TTableSortButtonProps) {
    const defaultClassName = "TableSortButton";
    let genClassName = "";

    const calcClassName = () => {
        let tempClassname = defaultClassName.split(" ").concat(addClassNames);

        if (isActive) {
            tempClassname.push("TableSortButton--active");
        }

        genClassName = tempClassname.join(" ");
    };

    const calcDataset = () => {
        if (!dataSet) return {};
        if (dataSet && dataSet.length === 0) return {};
        let temp: any = {};

        for (let dataitem of dataSet) {
            temp[`data-${dataitem.name}`] = dataitem.value;
        }

        return temp;
    };

    calcClassName();
    const prepareDataSet = calcDataset();

    return (
        <IconButton className={genClassName} aria-label={``} sx={ButtonStyle} onClick={onClick} title={title} {...prepareDataSet} data-icon={icon}>
            {icon === "top" ? <ArrowUpwardIcon fontSize={size} /> : <ArrowDownwardIcon fontSize={size} />}
        </IconButton>
    );
}

const TableSortButton_memo = React.memo(TableSortButton);
const TableSortButton_memo_is_equal = React.memo(TableSortButton, deep_object_is_equal);
export { TableSortButton, TableSortButton_memo, TableSortButton_memo_is_equal };
