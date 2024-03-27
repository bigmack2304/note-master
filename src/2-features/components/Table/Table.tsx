import React, { useState, useEffect, useRef, useCallback } from "react";
import { excludedColumnsTable, filterTableData, sortTableData, cellValueUpdate } from "./utils/TableFunc";
import { TableHead } from "./components/TableHead/TableHead";
import { TableBody } from "./components/TableBody/TableBody";
import { TableControls } from "./components/TableControls/TableControls";
import type { TTableValue, TBodyComponentTable } from "0-shared/types/dataSave";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { TOperators } from "./components/TableFilterButton/TableFilterButton";
import type { TActiveCellData } from "./commonTypes/types";
import { Box } from "@mui/material";
import "./Table.scss";
import * as style from "./TableStyle";

// DESC: ОХ ЗРЯ ТЫ СЮДА ПОЛЕЗ...

type TTableProps = {
    addClassNames?: string[];
    tableRenderData: TTableValue;
    editMode?: boolean;
    tableDesc?: TBodyComponentTable["desc"];
    tableViewControls?: TBodyComponentTable["viewButtons"];
    backLight?: TBodyComponentTable["backlight"];
    onSave?: (newValue: TTableValue) => void;
};

/**
 * таблица
 * TODO: возможно в будующем стоит удалить это и воспользовотся како-нибудь библиотекой
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function Table({ addClassNames = [], tableRenderData, editMode, tableDesc = "", onSave, tableViewControls = true, backLight = true }: TTableProps) {
    const savedRenderData = useRef(structuredClone(tableRenderData)); // копия tableRenderData, изменяется при редактировании таблицы
    const inputDubleCellValue = useRef<HTMLInputElement>(); // ссылка на инпут дублирующий инпут клеточки
    const targetActiveCell = useRef<HTMLInputElement>(); // ссылка на ячейку которая в последний раз была в фокусе
    const focusCellData = useRef<TActiveCellData>({ bodyRow: NaN, bodyColumn: NaN, headerColumn: NaN, inputDubleCellValue, targetActiveCell }); // обьект с данными который содержит индексы редактируемых клеточек а также ссылки на активную клеточку и инпут дублирующий ее значение
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
    const themeValue = useTemeMode();

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

    // возвращает стейты (геттеры и сеттеры) для фильтров
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

    // возвращает стейты (геттеры и сеттеры) для выборов колонок и строк
    const getStateSelect = () => {
        return {
            editSelectColumnIndex,
            setEditSelectColumnIndex,
            editSelectRowIndex,
            setEditSelectRowIndex,
        };
    };

    // возвращает стейты (геттеры и сеттеры) для сортировок
    const getStateSort = () => {
        return {
            sortHeaderIndex,
            sortHeaderType,
            setSortHeaderType,
            setSortHeaderIndex,
        };
    };

    // возвращает стейты (геттеры и сеттеры) для ячеек которые нужно скрыть
    const getStateExcludeColumns = () => {
        return {
            excludeColumns,
            setExcludeColumns,
        };
    };

    // возвращает рефы на инпут дублирующий инпут клеточки и на обьект focusCellData
    const getRefsInputDubleCellValue = () => {
        return {
            inputDubleCellValue,
            focusCellData,
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

    // изменение значения в клеточке
    const onCellValueUpdate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        cellValueUpdate({ focusCellData, savedRenderData });
    }, []);

    // фокус на клеточке
    const onCellValueFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        focusCellData.current.bodyRow = Number(e.target.dataset.row_index);
        focusCellData.current.bodyColumn = Number(e.target.dataset.column_index);
        focusCellData.current.headerColumn = Number(e.target.dataset.header_index);
        targetActiveCell.current = e.currentTarget;
        if (inputDubleCellValue.current) inputDubleCellValue.current.value = e.target.value; // обновить value в дублирующем инпуте

        const dubleInput = focusCellData.current.inputDubleCellValue.current;
        if (dubleInput) dubleInput.disabled = false;
    }, []);

    // фокус уходит с клеточки
    const onCellValueBlur = useCallback((e: React.FocusEvent) => {
        const dubleInput = focusCellData.current.inputDubleCellValue.current;
        if (!e.relatedTarget?.className.includes("MuiInputBase-input")) {
            if (dubleInput) {
                dubleInput.disabled = true;
                dubleInput.value = "";
            }
        } else {
            if (dubleInput) dubleInput.disabled = false;
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

    useEffect(() => {
        if (!editMode) {
            targetActiveCell.current = undefined;
            focusCellData.current = { bodyColumn: NaN, bodyRow: NaN, headerColumn: NaN, inputDubleCellValue: inputDubleCellValue, targetActiveCell: targetActiveCell };
        }
    }, [editMode]);

    calcClassName();

    return (
        <Box component="div" className={genClassName} sx={style.tableStyle(themeValue)}>
            <TableControls
                sortedFiltredRenderData={sortedFiltredRenderData}
                savedRenderData={savedRenderData}
                editMode={editMode}
                tableViewControls={tableViewControls}
                updateView={updateView}
                resetSort={resetSort}
                getStateExcludeColumns={getStateExcludeColumns}
                getStateFilter={getStateFilter}
                getStateSelect={getStateSelect}
                getStateSort={getStateSort}
                getRefsInputDubleCellValue={getRefsInputDubleCellValue}
                onResetClick={onResetClick}
                onSave={onSave}
            />
            <table className="Table__table">
                <caption className="Table__desc">{tableDesc}</caption>
                <thead className="Table__headers">
                    <TableHead
                        tableViewControls={tableViewControls}
                        sortedFiltredRenderData={sortedFiltredRenderData}
                        editMode={editMode}
                        onCellValueBlur={onCellValueBlur}
                        onCellValueUpdate={onCellValueUpdate}
                        onEditSelectTable={onEditSelectTable}
                        onCellValueFocus={onCellValueFocus}
                        getStateSort={getStateSort}
                        getStateSelect={getStateSelect}
                    />
                </thead>
                <Box component="tbody" sx={style.tableBody(themeValue, backLight)}>
                    <TableBody
                        sortedFiltredRenderData={sortedFiltredRenderData}
                        editMode={editMode}
                        getStateSelect={getStateSelect}
                        onCellValueBlur={onCellValueBlur}
                        onCellValueUpdate={onCellValueUpdate}
                        onEditSelectTable={onEditSelectTable}
                        onCellValueFocus={onCellValueFocus}
                    />
                </Box>
            </table>
        </Box>
    );
}

export { Table };
