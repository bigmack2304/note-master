import React, { useState, useEffect, useRef } from "react";
import { Typography, Box, Input } from "@mui/material";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import { TableSortButton } from "0-shared/components/TableSortButton/TableSortButton";
import { ResetButton } from "0-shared/components/ResetButton/ResetButton";
import { TableColumnsButton } from "2-features/components/TableColumnsButton/TableColumnsButton";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { TableFilterButton } from "2-features/components/TableFilterButton/TableFilterButton";
import type { TTableValue, TTableRow } from "0-shared/types/dataSave";
import type { TOperators } from "2-features/components/TableFilterButton/TableFilterButton";
import { Checkbox } from "0-shared/components/Checkbox/Checkbox";
import { excludedColumnsTable, filterTableData, sortTableData } from "./TableFunc";
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
    onSave?: () => void;
};

/**
 *
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function Table({ addClassNames = [], tableRenderData, editMode, tableDesc = "", onSave }: TTableProps) {
    const savedRenderData = useRef(structuredClone(tableRenderData));
    const isCellValueUpdate = useRef(false);
    const [sortedFiltredRenderData, setSortedFiltredRenderData] = useState(structuredClone(savedRenderData.current));
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
        if (isFilterActive && [...excColumns.values()].includes(filterColumnIndex)) {
            setFilterColumnIndex("");
            setFilterOperator("");
            setFilterValue("");
        }

        setEditSelectColumnIndex([]); // можно удалять только если там есть колонка которую скрываем
        setExcludeColumns(excColumns);
    };

    // закрытие меню фильтра
    const onTableFilterButtonClose = (filterColumnIndex: number | "", filterOperator: TOperators, filterValue: string, isChange: boolean) => {
        if (!isChange) return;
        setFilterColumnIndex(filterColumnIndex);
        setFilterOperator(filterOperator);
        setFilterValue(filterValue);
        setEditSelectRowIndex([]);
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
        //onCellsDelete && onCellsDelete(editSelectRowIndex, editSelectColumnIndex);
        let isChange = false;

        if (editSelectColumnIndex.length !== 0) {
            isChange = true;
            for (let selectColumnIndex of editSelectColumnIndex) {
                savedRenderData.current.headers = savedRenderData.current.headers.filter((column) => {
                    if (column.colIndex === selectColumnIndex) return false;
                    return true;
                });
                for (let row of savedRenderData.current.rows) {
                    row.value = row.value.filter((column) => {
                        if (column.colIndex === selectColumnIndex) return false;
                        return true;
                    });
                }
                setEditSelectColumnIndex((state) => {
                    return [...state].filter((value) => {
                        if (selectColumnIndex !== value) return true;
                        return false;
                    });
                });

                if (filterColumnIndex !== "" && selectColumnIndex === Number(filterColumnIndex)) {
                    setFilterColumnIndex("");
                    setFilterOperator("");
                    setFilterValue("");
                }

                if (sortHeaderIndex !== "" && selectColumnIndex === Number(sortHeaderIndex)) {
                    setSortHeaderIndex("");
                    setSortHeaderType("top");
                }
            }
        }

        if (editSelectRowIndex.length !== 0) {
            isChange = true;
            for (let selectRowIndex of editSelectRowIndex) {
                savedRenderData.current.rows = savedRenderData.current.rows.filter((row) => {
                    if (row.rowIndex === selectRowIndex) return false;
                    return true;
                });

                setEditSelectRowIndex((state) => {
                    return [...state].filter((value) => {
                        if (selectRowIndex !== value) return true;
                        return false;
                    });
                });
            }
        }

        if (isChange) {
            /// приводит индексы в порядок
            savedRenderData.current.headers = savedRenderData.current.headers.map((column, index) => {
                return { colIndex: index, value: column.value };
            });
            for (let row of savedRenderData.current.rows) {
                row.value = row.value.map((column, index) => {
                    return { colIndex: index, value: column.value };
                });
            }

            setSortedFiltredRenderData((state) => {
                const exclude = excludedColumnsTable(structuredClone(savedRenderData.current), excludeColumns);
                const filter = filterTableData(exclude, filterColumnIndex, filterOperator, filterValue);
                const sortColIndex = sortHeaderIndex === "" ? undefined : sortHeaderIndex;
                const sort = sortTableData(filter, Number(sortColIndex), sortHeaderType);
                return sort;
            });
        }
    };

    // нажатие на кнопку добавления строки или колонки
    const onTableAdd = (type: "row" | "column", amount: number) => {
        //onAdd && onAdd(type, amount);
        if (type == "column") {
            const savedMaxColIndex = savedRenderData.current.headers.length === 0 ? 0 : savedRenderData.current.headers.length;
            let maxColIndex = savedMaxColIndex;
            for (let i = 0; i < amount; i++) {
                savedRenderData.current.headers.push({ value: "", colIndex: maxColIndex++ });
            }

            maxColIndex = savedMaxColIndex;

            for (let row of savedRenderData.current.rows) {
                for (let i = 0; i < amount; i++) {
                    row.value.push({ value: "", colIndex: maxColIndex++ });
                }
                maxColIndex = savedMaxColIndex;
            }
        }

        if (type == "row") {
            const savedMaxColIndex = savedRenderData.current.headers.length === 0 ? 0 : savedRenderData.current.headers.length;
            const savedMaxRowIndex = savedRenderData.current.rows.length === 0 ? 0 : savedRenderData.current.rows.length;
            let maxRowIndex = savedMaxRowIndex;
            let prepareRow: TTableRow = { rowIndex: 0, value: [] };

            for (let i = 0; i < amount; i++) {
                prepareRow.rowIndex = maxRowIndex++;
                for (let k = 0; k < savedMaxColIndex; k++) {
                    prepareRow.value.push({ value: "", colIndex: k });
                }
                savedRenderData.current.rows.push(prepareRow);
                prepareRow = { rowIndex: 0, value: [] };
            }
        }

        setSortedFiltredRenderData((state) => {
            const exclude = excludedColumnsTable(structuredClone(savedRenderData.current), excludeColumns);
            const filter = filterTableData(exclude, filterColumnIndex, filterOperator, filterValue);
            const sortColIndex = sortHeaderIndex === "" ? undefined : sortHeaderIndex;
            const sort = sortTableData(filter, Number(sortColIndex), sortHeaderType);
            return sort;
        });
    };

    // нажатие на кнопку отчистить
    const onTableDelText = () => {
        //onCellsClear && onCellsClear(editSelectRowIndex, editSelectColumnIndex);
        let isChange = false;

        if (editSelectRowIndex.length > 0 || editSelectColumnIndex.length > 0) {
            // чистить мы можем с привязкой к показынным ячейкам или с привязкой к выбранной строке/колонке
            let cellsId: string[] = [];

            const calcCellsId = () => {
                for (let row of sortedFiltredRenderData.rows) {
                    // if (editSelectRowIndex.includes(row.rowIndex)) {
                    for (let col of row.value) {
                        if (editSelectColumnIndex.includes(col.colIndex)) {
                            cellsId.push(JSON.stringify({ row: row.rowIndex, col: col.colIndex }));
                            continue;
                        }
                        if (editSelectRowIndex.includes(row.rowIndex)) {
                            cellsId.push(JSON.stringify({ row: row.rowIndex, col: col.colIndex }));
                        }
                    }
                    // }
                }
            };
            calcCellsId();

            savedRenderData.current.rows = savedRenderData.current.rows.map((row) => {
                return {
                    rowIndex: row.rowIndex,
                    value: row.value.map((column) => {
                        let value = column.value;

                        // if (editSelectRowIndex.includes(row.rowIndex)) {
                        //     isChange = true;
                        //     value = "";
                        // }

                        // if (editSelectColumnIndex.includes(column.colIndex)) {
                        //     isChange = true;
                        //     value = "";
                        // }

                        if (cellsId.includes(JSON.stringify({ row: row.rowIndex, col: column.colIndex }))) {
                            isChange = true;
                            value = "";
                        }

                        return { value: value, colIndex: column.colIndex };
                    }),
                };
            });
        }

        if (isChange) {
            setSortedFiltredRenderData((state) => {
                const exclude = excludedColumnsTable(structuredClone(savedRenderData.current), excludeColumns);
                const filter = filterTableData(exclude, filterColumnIndex, filterOperator, filterValue);
                const sortColIndex = sortHeaderIndex === "" ? undefined : sortHeaderIndex;
                const sort = sortTableData(filter, Number(sortColIndex), sortHeaderType);
                return sort;
            });
        }
    };

    // нажатие на кнопку сохранить
    const onTableSave = () => {
        onSave && onSave();
    };

    // изменение значения в клеточке
    const onCellValueUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bodyRow = Number(e.target.dataset.row_index);
        const bodyColumn = Number(e.target.dataset.column_index);
        const headerColumn = Number(e.target.dataset.header_index);
        let inputValue = e.target.value;
        //let isChange = false;

        if (!isNaN(bodyRow) && !isNaN(bodyColumn)) {
            outer: for (let row of savedRenderData.current.rows) {
                for (let col of row.value) {
                    if (bodyRow === row.rowIndex && bodyColumn === col.colIndex) {
                        col.value = inputValue;
                        //isChange = true;
                        isCellValueUpdate.current = true;
                        break outer;
                    }
                }
            }
        }

        if (!isNaN(headerColumn)) {
            for (let col of savedRenderData.current.headers) {
                if (col.colIndex === headerColumn) {
                    col.value = inputValue;
                    //isChange = true;
                    isCellValueUpdate.current = true;
                    break;
                }
            }
        }

        // if (isChange) {
        //     setSortedFiltredRenderData((state) => {
        //         const exclude = excludedColumnsTable(structuredClone(savedRenderData.current), excludeColumns);
        //         const filter = filterTableData(exclude, filterColumnIndex, filterOperator, filterValue);
        //         const sortColIndex = sortHeaderIndex === "" ? undefined : sortHeaderIndex;
        //         const sort = sortTableData(filter, Number(sortColIndex), sortHeaderType);
        //         return filter;
        //     });
        // }
    };

    const onCellValueBlur = () => {
        if (isCellValueUpdate.current) {
            isCellValueUpdate.current = false;

            setSortedFiltredRenderData((state) => {
                const exclude = excludedColumnsTable(structuredClone(savedRenderData.current), excludeColumns);
                const filter = filterTableData(exclude, filterColumnIndex, filterOperator, filterValue);
                const sortColIndex = sortHeaderIndex === "" ? undefined : sortHeaderIndex;
                const sort = sortTableData(filter, Number(sortColIndex), sortHeaderType);
                return sort;
            });
        }
    };

    useEffect(() => {
        savedRenderData.current = structuredClone(tableRenderData);
        setSortedFiltredRenderData(structuredClone(savedRenderData.current));
        onResetClick();
    }, [tableRenderData]);

    useEffect(() => {
        //savedRenderData.current = structuredClone(tableRenderData);

        setSortedFiltredRenderData((state) => {
            const exclude = excludedColumnsTable(structuredClone(savedRenderData.current), excludeColumns);
            const filter = filterTableData(exclude, filterColumnIndex, filterOperator, filterValue);
            const sortColIndex = sortHeaderIndex === "" ? undefined : sortHeaderIndex;
            const sort = sortTableData(filter, Number(sortColIndex), sortHeaderType);
            return sort;
        });
    }, [sortHeaderIndex, sortHeaderType, filterValue, filterOperator, filterColumnIndex, excludeColumns]);

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
                    allColumns={savedRenderData.current.headers}
                    excludeColumns={excludeColumns}
                    onCloseSave={onTableColumnsButtonClose}
                    isActive={isTableColumnsButtonActive}
                    addClassNames={["Table__control_button"]}
                />
                <TableFilterButton
                    size="small"
                    allColumns={sortedFiltredRenderData.headers}
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
                            {sortedFiltredRenderData.headers.map((hValue) => {
                                let cellClass = "Table__header";
                                if (editMode) {
                                    if (editSelectColumnIndex.includes(hValue.colIndex)) {
                                        cellClass = cellClass + " Table__cell_select";
                                    }
                                }
                                return (
                                    <Box component="th" key={generateHashCode(hValue.value, hValue.colIndex)} className={cellClass} sx={style.cell(temeValue)}>
                                        <div className="Table__header_inner_container">
                                            {editMode ? (
                                                <>
                                                    <Input
                                                        type="text"
                                                        defaultValue={hValue.value}
                                                        autoComplete="off"
                                                        className="Table__header_text_input"
                                                        key={generateHashCode(hValue.value, hValue.colIndex)}
                                                        inputProps={{ "data-header_index": hValue.colIndex }}
                                                        onChange={onCellValueUpdate}
                                                        onBlur={onCellValueBlur}
                                                    />
                                                </>
                                            ) : (
                                                <Typography className="Table__header_text">{hValue.value}</Typography>
                                            )}
                                            <div className="Table__header_controls_container">
                                                {editMode && (
                                                    <Checkbox
                                                        size="small"
                                                        addClassNames={["Table__editable_select_column"]}
                                                        dataSet={[{ name: "header_index", value: String(hValue.colIndex) }]}
                                                        onChange={onEditSelectTable}
                                                        checked={editSelectColumnIndex.includes(hValue.colIndex)}
                                                    />
                                                )}
                                                <TableSortButton
                                                    addClassNames={["Table__header_sort_button"]}
                                                    dataSet={[{ name: "header_index", value: String(hValue.colIndex) }]}
                                                    isActive={sortHeaderIndex === String(hValue.colIndex)}
                                                    icon={sortHeaderIndex === String(hValue.colIndex) ? sortHeaderType : "top"}
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
                        sortedFiltredRenderData.rows.map((row) => {
                            // рендер всей строки

                            //if (!checkFilter(isFilterActive, row, filterColumnIndex, filterValue, filterOperator)) return; // применение фильтров
                            return (
                                <Box component={"tr"} key={generateHashCode(`rowIndex${row.rowIndex}`, row.rowIndex)} className="Table__row_body" sx={style.rowBody(temeValue)}>
                                    {/* селекторы строк в режиме редактирования */}
                                    {editMode && (
                                        <td className="Table__body--edit">
                                            <Checkbox
                                                size="small"
                                                addClassNames={["Table__editable_select_row"]}
                                                dataSet={[{ name: "row_index", value: String(row.rowIndex) }]}
                                                onChange={onEditSelectTable}
                                                checked={editSelectRowIndex.includes(row.rowIndex)}
                                            />
                                        </td>
                                    )}
                                    {/* рендер отденльной клеточки строки */}
                                    {row.value.map((itemValue) => {
                                        let cellClass = "Table__body";
                                        if (editMode) {
                                            if (editSelectColumnIndex.includes(itemValue.colIndex) || editSelectRowIndex.includes(row.rowIndex)) {
                                                cellClass = cellClass + " Table__cell_select";
                                            }
                                        }
                                        return (
                                            <Box
                                                key={generateHashCode(String(row.rowIndex), itemValue.colIndex)}
                                                data-row_index={row.rowIndex}
                                                data-column_index={itemValue.colIndex}
                                                className={cellClass}
                                                component="td"
                                                sx={style.cell(temeValue)}
                                            >
                                                <div className="Table__body_inner_container">
                                                    {editMode ? (
                                                        <Input
                                                            type="text"
                                                            defaultValue={itemValue.value}
                                                            autoComplete="off"
                                                            className="Table__body_text_input"
                                                            inputProps={{ "data-column_index": itemValue.colIndex, "data-row_index": row.rowIndex }}
                                                            key={generateHashCode(itemValue.value, row.rowIndex + itemValue.colIndex)}
                                                            onChange={onCellValueUpdate}
                                                            onBlur={onCellValueBlur}
                                                        />
                                                    ) : (
                                                        <Typography className="Table__body_text">{itemValue.value}</Typography>
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
