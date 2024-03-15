import React, { useState, useEffect } from "react";
import { Typography, Box, TextField } from "@mui/material";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import { TableSortButton } from "0-shared/components/TableSortButton/TableSortButton";
import { ResetButton } from "0-shared/components/ResetButton/ResetButton";
import { TableColumnsButton } from "2-features/components/TableColumnsButton/TableColumnsButton";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { TableFilterButton } from "2-features/components/TableFilterButton/TableFilterButton";
import type { TTableValue } from "0-shared/types/dataSave";
import type { TOperators } from "2-features/components/TableFilterButton/TableFilterButton";
import { checkFilter } from "./TableFilter";
import * as style from "./TableStyle";
import "./Table.scss";

type TTableProps = {
    addClassNames?: string[];
    tableRenderData: TTableValue;
    editMode?: boolean;
    tableDesc?: string;
};

/**
 *
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function Table({ addClassNames = [], tableRenderData, editMode, tableDesc = "" }: TTableProps) {
    const [prepareRenderData, setPrepareRenderData] = useState(tableRenderData);
    const [excludeColumns, setExcludeColumns] = useState<Set<number>>(new Set()); // индексы колонок которые не нужно показывать
    const [sortHeaderIndex, setSortHeaderIndex] = useState<string>(""); // индекс колонки в которой была нажата стрелочка
    const [sortHeaderType, setSortHeaderType] = useState<"top" | "bottom">("top"); // тип сортировки колонки в которой нажимали по стрелочке
    const [filterColumnIndex, setFilterColumnIndex] = useState<number | "">(""); // фильтруемая колонка
    const [filterOperator, setFilterOperator] = useState<TOperators>(""); // оператор фильтра
    const [filterValue, setFilterValue] = useState<string>(""); // сравнивающее значение фильтра (евоный text input)
    const isTableColumnsButtonActive = excludeColumns.size > 0; // активна-ли опция скрытия колонок
    const isFilterActive = filterOperator !== "" && filterColumnIndex !== ""; // активен-ли фильтр
    const temeValue = useTemeMode();

    const defaultClassName = "Table";
    let genClassName = "";

    const calcClassName = () => {
        let tempClassname = defaultClassName.split(" ").concat(addClassNames);

        if (editMode) {
            tempClassname.push("Table--editMode");
        }

        genClassName = tempClassname.join(" ");
    };

    //сортировка по калонкам
    const sortTableData = (sortIndex: number, sortType: "top" | "bottom") => {
        let temp = { ...prepareRenderData };
        let arr = [...temp.rows];
        arr = arr.sort((a, b) => {
            let prepareA = isNaN(Number(a[sortIndex])) ? a[sortIndex] : Number(a[sortIndex]);
            let prepareB = isNaN(Number(b[sortIndex])) ? b[sortIndex] : Number(b[sortIndex]);

            if (prepareA === prepareB) return 0;
            if (prepareA > prepareB) return sortType === "top" ? 1 : -1;
            return sortType === "top" ? -1 : 1;
        });
        temp.rows = arr;
        setPrepareRenderData(temp);
    };

    // нажатие на какуюто кнопку сортировки в колонках
    const onTableSortButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        const index = (e.currentTarget as HTMLButtonElement).dataset.header_index;
        const iconType = (e.currentTarget as HTMLButtonElement).dataset.icon as "top" | "bottom";

        if (!index || !iconType) return;
        setSortHeaderIndex(index);
        setSortHeaderType(iconType === "top" ? "bottom" : "top");
        sortTableData(Number(index), iconType);
    };

    // закритие меню показа колонок
    const onTableColumnsButtonClose = (excColumns: Set<number>, isChange: boolean) => {
        if (!isChange) return;
        setFilterColumnIndex("");
        setFilterOperator("");
        setFilterValue("");
        setSortHeaderIndex("");
        setExcludeColumns(excColumns);
    };

    // закрытие меню фильтра
    const onTableFilterButtonClose = (filterColumnIndex: number | "", filterOperator: TOperators, filterValue: string, isChange: boolean) => {
        if (!isChange) return;
        setFilterColumnIndex(filterColumnIndex);
        setFilterOperator(filterOperator);
        setFilterValue(filterValue);
    };

    // кнопка сброса фильтров
    const onResetClick = () => {
        setFilterColumnIndex("");
        setFilterOperator("");
        setFilterValue("");
        setSortHeaderIndex("");
        setExcludeColumns(new Set());
    };

    useEffect(() => {
        setPrepareRenderData(tableRenderData);
        setSortHeaderIndex("");
        setSortHeaderType("top");
    }, [tableRenderData]);

    calcClassName();

    return (
        <div className={genClassName}>
            {editMode && <div className="Table__edit_controls"></div>}
            <div className="Table__view_controls">
                <TableColumnsButton
                    size="small"
                    allColumns={tableRenderData.headers}
                    excludeColumns={excludeColumns}
                    onCloseSave={onTableColumnsButtonClose}
                    isActive={isTableColumnsButtonActive}
                />
                <TableFilterButton
                    size="small"
                    allColumns={tableRenderData.headers}
                    excludeColumns={excludeColumns}
                    onCloseSave={onTableFilterButtonClose}
                    filterColumnIndex={filterColumnIndex}
                    filterOperator={filterOperator}
                    filterValue={filterValue}
                    isActive={isFilterActive}
                />
                <ResetButton onClick={onResetClick} title="Сброс фильтров" />
            </div>
            <table className="Table__table">
                <caption className="Table__desc">{tableDesc}</caption>
                {/* <colgroup>
                    <col />
                    <col />
                    <col />
                </colgroup> */}
                <thead className="Table__headers">
                    {prepareRenderData.headers.length > 0 && (
                        <tr>
                            {prepareRenderData.headers.map((hValue, index) => {
                                if (excludeColumns.has(index)) return;
                                return (
                                    <th key={generateHashCode(hValue, index)} className="Table__header">
                                        <div className="Table__header_inner_container">
                                            {editMode ? (
                                                <TextField variant="standard" defaultValue={hValue} data-header_index={index} className="Table__header_text_input" />
                                            ) : (
                                                <Typography className="Table__header_text">{hValue}</Typography>
                                            )}
                                            <TableSortButton
                                                addClassNames={["Table__header_sort_button"]}
                                                dataSet={[{ name: "header_index", value: String(index) }]}
                                                isActive={sortHeaderIndex === String(index)}
                                                icon={sortHeaderIndex === String(index) ? sortHeaderType : "top"}
                                                onClick={onTableSortButton}
                                            />
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {prepareRenderData.rows.length > 0 &&
                        prepareRenderData.rows.map((row, rowIndex) => {
                            // рендер всей строки

                            if (!checkFilter(isFilterActive, row, filterColumnIndex, filterValue, filterOperator)) return;
                            return (
                                <Box component={"tr"} key={generateHashCode(`rowIndex${rowIndex}`, rowIndex)} className="Table__row_body" sx={style.rowBody(temeValue)}>
                                    {/* рендер отденльной колонки строки */}
                                    {row.map((itemValue, columnIndex) => {
                                        if (excludeColumns.has(columnIndex)) return;
                                        return (
                                            <td
                                                key={generateHashCode(String(rowIndex), columnIndex)}
                                                data-row_index={rowIndex}
                                                data-column_index={columnIndex}
                                                className="Table__body"
                                            >
                                                <div className="Table__body_inner_container">
                                                    {editMode ? (
                                                        <TextField
                                                            variant="standard"
                                                            defaultValue={itemValue}
                                                            data-row_index={rowIndex}
                                                            data-column_index={columnIndex}
                                                            className="Table__body_text_input"
                                                        />
                                                    ) : (
                                                        <Typography className="Table__body_text">{itemValue}</Typography>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </Box>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}

export { Table };
