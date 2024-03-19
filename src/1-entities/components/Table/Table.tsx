import React, { useState, useEffect, useRef, useCallback } from "react";
import { excludedColumnsTable, filterTableData, sortTableData, cellValueUpdate } from "./TableFunc";
import { TableHead } from "./TableHead";
import { TableBody } from "./TableBody";
import { TableControls } from "./TableControls";
import type { TTableValue } from "0-shared/types/dataSave";
import type { TOperators } from "2-features/components/TableFilterButton/TableFilterButton";
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
    const savedRenderData = useRef(structuredClone(tableRenderData)); // копия tableRenderData, изменяется при редактировании таблицы
    const isCellValueUpdate = useRef(false); // флаг что юзер изменил данные в клеточке в режиме редактирования
    const [sortedFiltredRenderData, setSortedFiltredRenderData] = useState(structuredClone(savedRenderData.current)); // копия savedRenderData, используется чисто для визуализации табличных данных
    const [excludeColumns, setExcludeColumns] = useState<Set<number>>(new Set()); // индексы колонок которые не нужно показывать (индексы привязаны к savedRenderData)
    const [sortHeaderIndex, setSortHeaderIndex] = useState<string>(""); // индекс колонки в которой была нажата стрелочка (индексы привязаны к savedRenderData)
    const [sortHeaderType, setSortHeaderType] = useState<"top" | "bottom">("top"); // тип сортировки колонки в которой нажимали по стрелочке
    const [filterColumnIndex, setFilterColumnIndex] = useState<number | "">(""); // фильтруемая колонка (индексы привязаны к savedRenderData)
    const [filterOperator, setFilterOperator] = useState<TOperators>(""); // оператор фильтра
    const [filterValue, setFilterValue] = useState<string>(""); // сравнивающее значение фильтра (евоный text input)
    const [editSelectColumnIndex, setEditSelectColumnIndex] = useState<number[]>([]); // выбранные колонки в режиме редактирования (индексы привязаны к savedRenderData)
    const [editSelectRowIndex, setEditSelectRowIndex] = useState<number[]>([]); // выбранные строки в режиме редактирования (индексы привязаны к savedRenderData)
    const isSortColIndex = sortHeaderIndex === "" ? undefined : sortHeaderIndex; // активнали сортировка TODO: sortHeaderIndex много где преобразуется в число а Number("") преобразуется в 0, поэтому проверяем так

    const defaultClassName = "Table";
    let genClassName = "";

    const calcClassName = () => {
        let tempClassname = defaultClassName.split(" ").concat(addClassNames);

        if (editMode) {
            tempClassname.push("Table--editMode");
        }

        genClassName = tempClassname.join(" ");
    };

    // сброс фильтров
    const resetFilter = () => {
        setFilterColumnIndex("");
        setFilterOperator("");
        setFilterValue("");
    };

    // сброс сортировок
    const resetSort = () => {
        setSortHeaderIndex("");
        setSortHeaderType("top");
    };

    const getStateFilter = () => {
        return {
            filterColumnIndex,
            filterOperator,
            filterValue,
            setFilterColumnIndex,
            setFilterOperator,
            setFilterValue,
            resetFilter,
        };
    };

    const getStateSelect = () => {
        return {
            editSelectColumnIndex,
            setEditSelectColumnIndex,
            editSelectRowIndex,
            setEditSelectRowIndex,
        };
    };

    const getStateSort = () => {
        return {
            sortHeaderIndex,
            sortHeaderType,
            setSortHeaderType,
            setSortHeaderIndex,
        };
    };

    // кнопка сброса фильтров
    const onResetClick = () => {
        resetFilter();
        resetSort();
        setEditSelectColumnIndex([]);
        setEditSelectRowIndex([]);
        setExcludeColumns(new Set());
    };

    // обновляет визуальное представление таблицы
    const updateView = () => {
        setSortedFiltredRenderData((state) => {
            let step = excludedColumnsTable(structuredClone(savedRenderData.current), excludeColumns);
            filterTableData(step, filterColumnIndex, filterOperator, filterValue);
            sortTableData(step, Number(isSortColIndex), sortHeaderType);
            return step;
        });
    };

    // выбор сктрок или колонок в режиме редактирования
    const onEditSelectTable = useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
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
    }, []);

    // нажатие на кнопку сохранить
    const onTableSave = useCallback(() => {
        onSave && onSave();
    }, []);

    // изменение значения в клеточке
    const onCellValueUpdate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        cellValueUpdate({ e, isCellValueUpdate, savedRenderData });
    }, []);

    const onCellValueBlur = useCallback(() => {
        if (isCellValueUpdate.current) {
            isCellValueUpdate.current = false;
            updateView();
        }
    }, []);

    useEffect(() => {
        savedRenderData.current = structuredClone(tableRenderData);
        setSortedFiltredRenderData(structuredClone(savedRenderData.current));
        onResetClick();
    }, [tableRenderData]);

    useEffect(() => {
        updateView();
    }, [sortHeaderIndex, sortHeaderType, filterValue, filterOperator, filterColumnIndex, excludeColumns]);

    calcClassName();

    return (
        <div className={genClassName}>
            <TableControls
                editMode={editMode}
                excludeColumns={excludeColumns}
                setExcludeColumns={setExcludeColumns}
                getStateFilter={getStateFilter}
                getStateSelect={getStateSelect}
                getStateSort={getStateSort}
                onResetClick={onResetClick}
                onTableSave={onTableSave}
                resetSort={resetSort}
                savedRenderData={savedRenderData}
                sortedFiltredRenderData={sortedFiltredRenderData}
                updateView={updateView}
            />
            <table className="Table__table">
                <caption className="Table__desc">{tableDesc}</caption>
                <thead className="Table__headers">
                    <TableHead
                        editMode={editMode}
                        editSelectColumnIndex={editSelectColumnIndex}
                        onCellValueBlur={onCellValueBlur}
                        onCellValueUpdate={onCellValueUpdate}
                        onEditSelectTable={onEditSelectTable}
                        getStateSort={getStateSort}
                        sortHeaderIndex={sortHeaderIndex}
                        sortHeaderType={sortHeaderType}
                        sortedFiltredRenderData={sortedFiltredRenderData}
                    />
                </thead>
                <tbody>
                    <TableBody
                        editMode={editMode}
                        editSelectColumnIndex={editSelectColumnIndex}
                        editSelectRowIndex={editSelectRowIndex}
                        onCellValueBlur={onCellValueBlur}
                        onCellValueUpdate={onCellValueUpdate}
                        onEditSelectTable={onEditSelectTable}
                        sortedFiltredRenderData={sortedFiltredRenderData}
                    />
                </tbody>
            </table>
        </div>
    );
}

export { Table };
