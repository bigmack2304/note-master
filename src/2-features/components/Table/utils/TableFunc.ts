import type { TOperators } from "../components/TableFilterButton/TableFilterButton";
import type { TTableValue, TTableRow } from "0-shared/types/dataSave";
import type { TActiveCellData } from "../commonTypes/types";
import { debug } from "console";

// вспомогательные функции для Table.tsx, работает в связке с ним. Поэтому все имена функций и других параметров стоит воспринемать как одно и тоже сдесь и в Table.tsx

type TOnDeleteSelectedParams = {
    editSelectColumnIndex: number[];
    savedRenderData: React.MutableRefObject<TTableValue>;
    setEditSelectColumnIndex: (value: React.SetStateAction<number[]>) => void;
    filterColumnIndex: number | "";
    editSelectRowIndex: number[];
    sortHeaderIndex: string;
    setEditSelectRowIndex: (value: React.SetStateAction<number[]>) => void;
    resetFilter: () => void;
    resetSort: () => void;
    updateView: () => void;
};

type TTableAddParams = {
    type: "row" | "column";
    savedRenderData: React.MutableRefObject<TTableValue>;
    amount: number;
    resetFilter: () => void;
    setExcludeColumns: (value: React.SetStateAction<Set<number>>) => void;
    updateView: () => void;
};

type TTableDelTextParams = {
    editSelectRowIndex: number[];
    editSelectColumnIndex: number[];
    sortedFiltredRenderData: TTableValue;
    savedRenderData: React.MutableRefObject<TTableValue>;
    updateView: () => void;
};

type TCellValueUpdateParams = {
    savedRenderData: React.MutableRefObject<TTableValue>;
    focusCellData: React.MutableRefObject<TActiveCellData>;
};

/**
 * проверяет удовлетворяют ли данные указанному фильтру
 */
function checkFilter(isFilterActive: boolean, row: TTableRow, filterColumnIndex: number | "", filterValue: string, filterOperator: TOperators) {
    if (isFilterActive) {
        if (filterColumnIndex === "") return true; // вообще этого кейса никогда не должно быть при текущем использовании, но навсякий случай (еще чтоб ts не ругался)

        // тут мы работаем с таблицей sortedFiltredRenderData, но индексы сортировок, фильтров итд. привязаны к savedRenderData, поэтому нужно найти именно ту колонку которую мы выбрали в sortedFiltredRenderData но данные которой относятся к savedRenderData
        const columnValue = row.value.find((value) => {
            if (value.colIndex === filterColumnIndex) return value;
        })?.value;

        if (!columnValue) return false;

        const filterValueNumber = Number(filterValue);
        const columnValueNumber = Number(columnValue);

        switch (filterOperator) {
            case "=":
                if (!isNaN(filterValueNumber) && !isNaN(columnValueNumber)) {
                    return filterValueNumber == columnValueNumber;
                }
                return columnValue == filterValue;
            case "<":
                if (!isNaN(filterValueNumber) && !isNaN(columnValueNumber)) {
                    return filterValueNumber < columnValueNumber;
                }
                return columnValue > filterValue;
            case ">": //TODO: операторы для строк и чисел намеренно перепутаны так как именно так все работает правильно
                if (!isNaN(filterValueNumber) && !isNaN(columnValueNumber)) {
                    return filterValueNumber > columnValueNumber;
                }
                return columnValue < filterValue;
            case "<=":
                if (!isNaN(filterValueNumber) && !isNaN(columnValueNumber)) {
                    return filterValueNumber <= columnValueNumber;
                }
                return columnValue >= filterValue;
            case ">=":
                if (!isNaN(filterValueNumber) && !isNaN(columnValueNumber)) {
                    return filterValueNumber >= columnValueNumber;
                }
                return columnValue <= filterValue;
            case "'т'..":
                return columnValue.startsWith(filterValue);
            case "..'т'":
                return columnValue.endsWith(filterValue);
            case "..'т'..":
                return columnValue.includes(filterValue);
            default:
                break;
        }
    }

    return true;
}

/**
 * сортировка по калонкам (изменяет входной фаил)
 */
function sortTableData(sortedFiltredRenderData: TTableValue, sortIndex: number, sortType: "top" | "bottom") {
    if (isNaN(sortIndex)) return sortedFiltredRenderData;

    let currentSortIndex: number | undefined = undefined; // этот кейс нужно прощитывать, так как sortIndex привязан к ячейке в savedRenderData, поэтому чтобы начать сортировку, нужно узнать в каком столбце sortedFiltredRenderData лежит элемент с col.colIndex = sortIndex
    // вся эта процедура требуется для того чтобы сортировка не сбивалась при применении различных филтров к таблице
    const calcCurrentSortIndex = () => {
        if (sortedFiltredRenderData.rows.length === 0) return undefined;
        let result = undefined;
        sortedFiltredRenderData.rows[0]?.value.forEach((col, index) => {
            if (col.colIndex === sortIndex) {
                result = index;
                return;
            }
        });
        return result;
    };

    currentSortIndex = calcCurrentSortIndex();

    if (currentSortIndex === undefined) return sortedFiltredRenderData;

    sortedFiltredRenderData.rows = sortedFiltredRenderData.rows.sort((a, b) => {
        let prepareA = isNaN(Number(a.value[currentSortIndex!].value)) ? a.value[currentSortIndex!].value : Number(a.value[currentSortIndex!].value);
        let prepareB = isNaN(Number(b.value[currentSortIndex!].value)) ? b.value[currentSortIndex!].value : Number(b.value[currentSortIndex!].value);

        // если какието данные не удалось преобразовать в число, то щитаем что обе данных строка
        if (typeof prepareA === "string" || typeof prepareB === "string") {
            prepareA = typeof prepareA !== "string" ? String(prepareA) : prepareA;
            prepareB = typeof prepareB !== "string" ? String(prepareB) : prepareB;
        }

        if (prepareA === prepareB) return 0;
        if (prepareA > prepareB) return sortType === "top" ? 1 : -1;
        return sortType === "top" ? -1 : 1;
    });

    return sortedFiltredRenderData;
}

/**
 * фильтрация таблицы (изменяет входной фаил)
 */
function filterTableData(sortedFiltredRenderData: TTableValue, filterColumnIndex: number | "", filterOperator: TOperators, filterValue: string) {
    const isFilterActive = filterOperator !== "" && filterColumnIndex !== "";
    if (!isFilterActive) return sortedFiltredRenderData;
    sortedFiltredRenderData.rows = sortedFiltredRenderData.rows.filter((row) => {
        if (!checkFilter(isFilterActive, row, filterColumnIndex, filterValue, filterOperator)) return false;
        return true;
    });

    return sortedFiltredRenderData;
}

/**
 * скрытие ненужных ячеек (изменяет входной фаил)
 */
function excludedColumnsTable(sortedFiltredRenderData: TTableValue, excludeColumns: Set<number>) {
    if (excludeColumns.size === 0) return sortedFiltredRenderData;

    sortedFiltredRenderData.rows = sortedFiltredRenderData.rows.map((row) => {
        const rowItems = row.value.filter((cell, cellIndex) => {
            if (excludeColumns.has(cellIndex)) return false;
            return true;
        });
        return { rowIndex: row.rowIndex, value: rowItems };
    });

    sortedFiltredRenderData.headers = sortedFiltredRenderData.headers.filter((cilumn, index) => {
        if (excludeColumns.has(index)) return false;
        return true;
    });

    return sortedFiltredRenderData;
}

/**
 * удаление выбранных строк или столбцов
 */
function deleteSelected({
    editSelectColumnIndex,
    savedRenderData,
    setEditSelectColumnIndex,
    filterColumnIndex,
    editSelectRowIndex,
    sortHeaderIndex,
    setEditSelectRowIndex,
    resetFilter,
    resetSort,
    updateView,
}: TOnDeleteSelectedParams) {
    let isChange = false;

    // удаление столбцов
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
            // убираем флажок выделения для этого столбца
            setEditSelectColumnIndex((state) => {
                return [...state].filter((value) => {
                    if (selectColumnIndex !== value) return true;
                    return false;
                });
            });

            if (filterColumnIndex !== "" && selectColumnIndex === Number(filterColumnIndex)) {
                resetFilter();
            }

            if (sortHeaderIndex !== "" && selectColumnIndex === Number(sortHeaderIndex)) {
                resetSort();
            }
        }
    }

    // удаление строк
    if (editSelectRowIndex.length !== 0) {
        isChange = true;
        for (let selectRowIndex of editSelectRowIndex) {
            savedRenderData.current.rows = savedRenderData.current.rows.filter((row) => {
                if (row.rowIndex === selectRowIndex) return false;
                return true;
            });
            // убираем флажок выделения для этой строки
            setEditSelectRowIndex((state) => {
                return [...state].filter((value) => {
                    if (selectRowIndex !== value) return true;
                    return false;
                });
            });
        }
    }

    if (isChange) {
        reCalcIndexes(savedRenderData.current, updateView);
    }
}

/**
 * прощитывает заново индексы колонки и столбца для каждой клеточки в таблице savedRenderData. Меняет savedRenderData
 * необходимо после удаления колонки или столбца
 */
function reCalcIndexes(savedRenderData: TTableValue, updateView: () => void) {
    savedRenderData.headers = savedRenderData.headers.map((column, index) => {
        return { colIndex: index, value: column.value };
    });
    for (let row of savedRenderData.rows) {
        row.value = row.value.map((column, index) => {
            return { colIndex: index, value: column.value };
        });
    }

    updateView();
}

/**
 * добовляет указанное количество строк или колонок в таблицу
 */
function tableAdd({ type, savedRenderData, amount, resetFilter, setExcludeColumns, updateView }: TTableAddParams) {
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

    resetFilter();
    setExcludeColumns(new Set());

    updateView();
}

/**
 * удаляет текст в выбранных ячейках. (выбор в sortedFiltredRenderData, удаление в savedRenderData)
 */
function tableDelText({ editSelectRowIndex, editSelectColumnIndex, sortedFiltredRenderData, savedRenderData, updateView }: TTableDelTextParams) {
    let isChange = false;

    if (editSelectRowIndex.length > 0 || editSelectColumnIndex.length > 0) {
        // чистить мы будем с привязкой к показынным ячейкам
        let cellsId: string[] = [];

        const calcCellsId = () => {
            for (let row of sortedFiltredRenderData.rows) {
                for (let col of row.value) {
                    if (editSelectColumnIndex.includes(col.colIndex)) {
                        cellsId.push(`row:${row.rowIndex}-col:${col.colIndex}`);
                        continue;
                    }
                    if (editSelectRowIndex.includes(row.rowIndex)) {
                        cellsId.push(`row:${row.rowIndex}-col:${col.colIndex}`);
                    }
                }
            }
        };

        calcCellsId();

        savedRenderData.current.rows = savedRenderData.current.rows.map((row) => {
            return {
                rowIndex: row.rowIndex,
                value: row.value.map((column) => {
                    let value = column.value;

                    if (cellsId.includes(`row:${row.rowIndex}-col:${column.colIndex}`)) {
                        isChange = true;
                        value = "";
                    }

                    return { value: value, colIndex: column.colIndex };
                }),
            };
        });
    }

    if (isChange) {
        updateView();
    }
}

/**
 * обновление данных в таблице (изменение )
 */
function cellValueUpdate({ focusCellData, savedRenderData }: TCellValueUpdateParams) {
    const activeCellData = focusCellData.current;
    const cellValue = activeCellData.targetActiveCell.current?.value;

    if (cellValue === undefined) return;

    if (!isNaN(activeCellData.bodyRow) && !isNaN(activeCellData.bodyColumn)) {
        outer: for (let row of savedRenderData.current.rows) {
            if (activeCellData.bodyRow !== row.rowIndex) continue;
            for (let col of row.value) {
                if (activeCellData.bodyColumn !== col.colIndex) continue;

                col.value = cellValue;
                if (activeCellData.inputDubleCellValue.current) activeCellData.inputDubleCellValue.current.value = cellValue; // обновить value в дублирующем инпуте
                break outer;
            }
        }
    }

    if (!isNaN(activeCellData.headerColumn)) {
        for (let col of savedRenderData.current.headers) {
            if (col.colIndex === activeCellData.headerColumn) {
                col.value = cellValue;
                if (activeCellData.inputDubleCellValue.current) activeCellData.inputDubleCellValue.current.value = cellValue; // обновить value в дублирующем инпуте
                break;
            }
        }
    }
}

export { checkFilter, sortTableData, filterTableData, excludedColumnsTable, deleteSelected, tableAdd, tableDelText, cellValueUpdate };
