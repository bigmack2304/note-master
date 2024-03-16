import React, { useState, useEffect } from "react";
import { Typography, Box, Input } from "@mui/material";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import { TableSortButton } from "0-shared/components/TableSortButton/TableSortButton";
import { ResetButton } from "0-shared/components/ResetButton/ResetButton";
import { TableColumnsButton } from "2-features/components/TableColumnsButton/TableColumnsButton";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { TableFilterButton } from "2-features/components/TableFilterButton/TableFilterButton";
import type { TTableValue } from "0-shared/types/dataSave";
import type { TOperators } from "2-features/components/TableFilterButton/TableFilterButton";
import { Checkbox } from "0-shared/components/Checkbox/Checkbox";
import { checkFilter } from "./TableFilter";
import { TableAddButton } from "2-features/components/TableAddButton/TableAddButton";
import { DeleteButton } from "0-shared/components/DeleteButton/DeleteButton";
import { DeleteTextButton } from "0-shared/components/DeleteTextButton/DeleteTextButton";
import { SaveButton } from "0-shared/components/SaveButton/SaveButton";
import * as style from "./TableStyle";
import "./Table.scss";

type TTableProps = {
    addClassNames?: string[];
    tableRenderData: TTableValue;
    editMode?: boolean;
    tableDesc?: string;
    onCellsDelete?: (rows: number[], columns: number[]) => void;
    onCellsClear?: (rows: number[], columns: number[]) => void;
    onAdd?: (type: "row" | "column", amount: number) => void;
    onSave?: () => void;
};

/**
 *
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function Table({ addClassNames = [], tableRenderData, editMode, tableDesc = "", onCellsDelete, onAdd, onCellsClear, onSave }: TTableProps) {
    const [savedRenderData, setSavedRenderData] = useState(structuredClone(tableRenderData));
    const [sortedFiltredRenderData, setSortedFiltredRenderData] = useState(structuredClone(tableRenderData));
    const [excludeColumns, setExcludeColumns] = useState<Set<number>>(new Set()); // индексы колонок которые не нужно показывать
    const [sortHeaderIndex, setSortHeaderIndex] = useState<string>(""); // индекс колонки в которой была нажата стрелочка
    const [sortHeaderType, setSortHeaderType] = useState<"top" | "bottom">("top"); // тип сортировки колонки в которой нажимали по стрелочке
    const [filterColumnIndex, setFilterColumnIndex] = useState<number | "">(""); // фильтруемая колонка
    const [filterOperator, setFilterOperator] = useState<TOperators>(""); // оператор фильтра
    const [filterValue, setFilterValue] = useState<string>(""); // сравнивающее значение фильтра (евоный text input)
    const [editSelectColumnIndex, setEditSelectColumnIndex] = useState<number[]>([]); // выбранные колонки в режиме редактирования
    const [editSelectRowIndex, setEditSelectRowIndex] = useState<number[]>([]); // выбранные строки в режиме редактирования
    const isCellsSelect = editSelectColumnIndex.length > 0 || editSelectRowIndex.length > 0; // выбраны-ли какието клеточки в режиме редактирования
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

    // сортировка по калонкам
    const sortTableData = (sortedFiltredRenderData: TTableValue, sortIndex: number, sortType: "top" | "bottom") => {
        if (isNaN(sortIndex)) return sortedFiltredRenderData;
        let temp = structuredClone(sortedFiltredRenderData);
        let arr = [...temp.rows];
        arr = arr.sort((a, b) => {
            let prepareA = isNaN(Number(a[sortIndex])) ? a[sortIndex] : Number(a[sortIndex]);
            let prepareB = isNaN(Number(b[sortIndex])) ? b[sortIndex] : Number(b[sortIndex]);

            if (prepareA === prepareB) return 0;
            if (prepareA > prepareB) return sortType === "top" ? 1 : -1;
            return sortType === "top" ? -1 : 1;
        });
        temp.rows = arr;
        return temp;
        //setSortedFiltredRenderData(temp);
    };

    // фильтрация таблицы
    const filterTableData = (sortedFiltredRenderData: TTableValue, filterColumnIndex: number | "", filterOperator: TOperators, filterValue: string) => {
        const isFilterActive = filterOperator !== "" && filterColumnIndex !== "";
        if (!isFilterActive) return sortedFiltredRenderData;
        let temp = structuredClone(sortedFiltredRenderData);
        temp.rows = temp.rows.filter((row) => {
            if (!checkFilter(isFilterActive, row, filterColumnIndex, filterValue, filterOperator)) return false;
            return true;
        });
        //setSortedFiltredRenderData(temp);

        return temp;
    };

    // скрытие ненужных ячеек
    const excludedColumnsTable = (sortedFiltredRenderData: TTableValue, excludeColumns: Set<number>) => {
        if (excludeColumns.size === 0) return sortedFiltredRenderData;
        let temp = structuredClone(sortedFiltredRenderData);

        temp.rows = temp.rows.map((row) => {
            // if (excludeColumns.has(index)) return false;
            // return true;
            return row.filter((cell, cellIndex) => {
                if (excludeColumns.has(cellIndex)) return false;
                return true;
            });
        });
        temp.headers = temp.headers.filter((cilumn, index) => {
            if (excludeColumns.has(index)) return false;
            return true;
        });
        //setSortedFiltredRenderData(temp);
        return temp;
    };

    // нажатие на какуюто кнопку сортировки в колонках
    const onTableSortButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        const index = (e.currentTarget as HTMLButtonElement).dataset.header_index;
        const iconType = (e.currentTarget as HTMLButtonElement).dataset.icon as "top" | "bottom";

        if (!index || !iconType) return;
        setSortHeaderIndex(index);
        setSortHeaderType(iconType === "top" ? "bottom" : "top");
        //sortTableData(Number(index), iconType);
    };

    // закритие меню показа колонок
    const onTableColumnsButtonClose = (excColumns: Set<number>, isChange: boolean) => {
        if (!isChange) return;
        // if (sortHeaderIndex !== "") setPrepareRenderData(tableRenderData);
        setFilterColumnIndex("");
        setFilterOperator("");
        setFilterValue("");
        // setSortHeaderIndex("");
        // setSortHeaderType("top");
        setEditSelectColumnIndex([]);
        setEditSelectRowIndex([]);
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
        // if (sortHeaderIndex !== "") setPrepareRenderData(tableRenderData);
        setFilterColumnIndex("");
        setFilterOperator("");
        setFilterValue("");
        setSortHeaderIndex("");
        setSortHeaderType("top");
        setEditSelectColumnIndex([]);
        setEditSelectRowIndex([]);
        setExcludeColumns(new Set());
    };

    // выбор сктрок или колонок в режиме редактирования
    const onEditSelectTable = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const selectRow = Number(event.currentTarget.dataset.row_index);
        const selectColumn = Number(event.currentTarget.dataset.header_index);
        if (!isNaN(selectRow)) {
            if (checked) {
                setEditSelectRowIndex((state) => {
                    return [...state, selectRow];
                });
            } else {
                setEditSelectRowIndex((state) => {
                    return [...state].filter((value) => {
                        if (selectRow !== value) return true;
                        return false;
                    });
                });
            }
        }
        if (!isNaN(selectColumn)) {
            if (checked) {
                setEditSelectColumnIndex((state) => {
                    return [...state, selectColumn];
                });
            } else {
                setEditSelectColumnIndex((state) => {
                    return [...state].filter((value) => {
                        if (selectColumn !== value) return true;
                        return false;
                    });
                });
            }
        }
    };

    // нажатие на кнопку удалить выбранное
    const onDeleteSelected = () => {
        onCellsDelete && onCellsDelete(editSelectRowIndex, editSelectColumnIndex);
    };

    // нажатие на кнопку добавления строки или колонки
    const onTableAdd = (type: "row" | "column", amount: number) => {
        onAdd && onAdd(type, amount);
    };

    // нажатие на кнопку отчистить
    const onTableDelText = () => {
        onCellsClear && onCellsClear(editSelectRowIndex, editSelectColumnIndex);
    };

    // нажатие на кнопку сохранить
    const onTableSave = () => {
        onSave && onSave();
    };

    // изменение значения в клеточке
    const onCellValueUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bodyctRow = Number(e.target.dataset.row_index);
        const bodyColumn = Number(e.target.dataset.column_index);
        const headerColumn = Number(e.target.dataset.header_index);
        let value = e.target.value;
    };

    // useEffect(() => {
    //     setSortedFiltredRenderData(tableRenderData);
    //     onResetClick();
    //     //if (sortHeaderIndex !== "") sortTableData(Number(sortHeaderIndex), sortHeaderType);
    // }, [tableRenderData]);

    useEffect(() => {
        setSortedFiltredRenderData((state) => {
            let exclude = excludedColumnsTable(tableRenderData, excludeColumns);
            let filter = filterTableData(exclude, filterColumnIndex, filterOperator, filterValue);
            let sort = sortTableData(filter, Number(sortHeaderIndex), sortHeaderType);
            return sort;
        });
    }, [sortHeaderIndex, sortHeaderType, filterValue, filterOperator, filterColumnIndex, excludeColumns, tableRenderData]);

    calcClassName();

    return (
        <div className={genClassName}>
            {editMode && (
                <div className="Table__edit_controls">
                    <SaveButton size="small" addClassNames={["Table__control_button"]} title="Сохранить" onClick={onTableSave} />
                    <TableAddButton addClassNames={["Table__control_button"]} onCloseSave={onTableAdd} />
                    <DeleteTextButton size="small" title="Отчистить выбранное" addClassNames={["Table__control_button"]} onClick={onTableDelText} disabled={!isCellsSelect} />
                    <DeleteButton size="small" title="Удалить выбранное" addClassNames={["Table__control_button"]} onClick={onDeleteSelected} disabled={!isCellsSelect} />
                </div>
            )}
            <div className="Table__view_controls">
                <TableColumnsButton
                    size="small"
                    allColumns={savedRenderData.headers}
                    excludeColumns={excludeColumns}
                    onCloseSave={onTableColumnsButtonClose}
                    isActive={isTableColumnsButtonActive}
                    addClassNames={["Table__control_button"]}
                />
                <TableFilterButton
                    size="small"
                    allColumns={savedRenderData.headers}
                    excludeColumns={excludeColumns}
                    onCloseSave={onTableFilterButtonClose}
                    filterColumnIndex={filterColumnIndex}
                    filterOperator={filterOperator}
                    filterValue={filterValue}
                    isActive={isFilterActive}
                    addClassNames={["Table__control_button"]}
                />
                <ResetButton onClick={onResetClick} title="Сброс фильтров" />
            </div>
            <table className="Table__table">
                <caption className="Table__desc">{tableDesc}</caption>
                <thead className="Table__headers">
                    {sortedFiltredRenderData.headers.length > 0 && (
                        <tr>
                            {/* селекторы колонок в режиме редактирования */}
                            {editMode && <th className="Table__header--edit"></th>}
                            {sortedFiltredRenderData.headers.map((hValue, index) => {
                                //if (excludeColumns.has(index)) return;
                                let cellClass = "Table__header";
                                if (editMode) {
                                    if (editSelectColumnIndex.includes(index)) {
                                        cellClass = cellClass + " Table__cell_select";
                                    }
                                }
                                return (
                                    <Box component="th" key={generateHashCode(hValue, index)} className={cellClass} sx={style.cell(temeValue)}>
                                        <div className="Table__header_inner_container">
                                            {editMode ? (
                                                <>
                                                    <Input
                                                        type="text"
                                                        defaultValue={hValue}
                                                        autoComplete="off"
                                                        className="Table__header_text_input"
                                                        key={generateHashCode(hValue, index)}
                                                        inputProps={{ "data-header_index": index }}
                                                        onChange={onCellValueUpdate}
                                                    />
                                                </>
                                            ) : (
                                                <Typography className="Table__header_text">{hValue}</Typography>
                                            )}
                                            <div className="Table__header_controls_container">
                                                {editMode && (
                                                    <Checkbox
                                                        size="small"
                                                        addClassNames={["Table__editable_select_column"]}
                                                        dataSet={[{ name: "header_index", value: String(index) }]}
                                                        onChange={onEditSelectTable}
                                                        checked={editSelectColumnIndex.includes(index)}
                                                    />
                                                )}
                                                <TableSortButton
                                                    addClassNames={["Table__header_sort_button"]}
                                                    dataSet={[{ name: "header_index", value: String(index) }]}
                                                    isActive={sortHeaderIndex === String(index)}
                                                    icon={sortHeaderIndex === String(index) ? sortHeaderType : "top"}
                                                    onClick={onTableSortButton}
                                                />
                                            </div>
                                        </div>
                                    </Box>
                                );
                            })}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {sortedFiltredRenderData.rows.length > 0 &&
                        sortedFiltredRenderData.rows.map((row, rowIndex) => {
                            // рендер всей строки

                            //if (!checkFilter(isFilterActive, row, filterColumnIndex, filterValue, filterOperator)) return; // применение фильтров
                            return (
                                <Box component={"tr"} key={generateHashCode(`rowIndex${rowIndex}`, rowIndex)} className="Table__row_body" sx={style.rowBody(temeValue)}>
                                    {/* селекторы строк в режиме редактирования */}
                                    {editMode && (
                                        <td className="Table__body--edit">
                                            <Checkbox
                                                size="small"
                                                addClassNames={["Table__editable_select_row"]}
                                                dataSet={[
                                                    { name: "row_index", value: String(rowIndex) },
                                                    // { name: "to_value", value: tableRenderData.rows[rowIndex][0] },
                                                ]}
                                                onChange={onEditSelectTable}
                                                checked={editSelectRowIndex.includes(rowIndex)}
                                            />
                                        </td>
                                    )}
                                    {/* рендер отденльной клеточки строки */}
                                    {row.map((itemValue, columnIndex) => {
                                        //if (excludeColumns.has(columnIndex)) return; // показываем выбранные колонки
                                        let cellClass = "Table__body";
                                        if (editMode) {
                                            if (editSelectColumnIndex.includes(columnIndex) || editSelectRowIndex.includes(rowIndex)) {
                                                cellClass = cellClass + " Table__cell_select";
                                            }
                                        }
                                        return (
                                            <Box
                                                key={generateHashCode(String(rowIndex), columnIndex)}
                                                data-row_index={rowIndex}
                                                data-column_index={columnIndex}
                                                className={cellClass}
                                                component="td"
                                                sx={style.cell(temeValue)}
                                            >
                                                <div className="Table__body_inner_container">
                                                    {editMode ? (
                                                        <Input
                                                            type="text"
                                                            defaultValue={itemValue}
                                                            autoComplete="off"
                                                            className="Table__body_text_input"
                                                            inputProps={{ "data-column_index": columnIndex, "data-row_index": rowIndex }}
                                                            key={generateHashCode(itemValue, rowIndex + columnIndex)}
                                                            onChange={onCellValueUpdate}
                                                        />
                                                    ) : (
                                                        <Typography className="Table__body_text">{itemValue}</Typography>
                                                    )}
                                                </div>
                                            </Box>
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
