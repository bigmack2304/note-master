import type { TOperators } from "2-features/components/TableFilterButton/TableFilterButton";
import type { TTableValue, TTableRow, TTableRowColumnItem } from "0-shared/types/dataSave";

function checkFilter(isFilterActive: boolean, row: TTableRow, filterColumnIndex: number | "", filterValue: string, filterOperator: TOperators) {
    if (isFilterActive) {
        if (filterColumnIndex === "") return true; // вообще этого кейса никогда не должно быть при текущем использовании, но навсякий случай (еще чтоб ts не ругался)

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

// сортировка по калонкам
function sortTableData(sortedFiltredRenderData: TTableValue, sortIndex: number, sortType: "top" | "bottom") {
    if (isNaN(sortIndex)) return sortedFiltredRenderData;
    let temp = structuredClone(sortedFiltredRenderData);
    let arr = [...temp.rows];
    arr = arr.sort((a, b) => {
        let prepareA = isNaN(Number(a.value[sortIndex].value)) ? a.value[sortIndex].value : Number(a.value[sortIndex].value);
        let prepareB = isNaN(Number(b.value[sortIndex].value)) ? b.value[sortIndex].value : Number(b.value[sortIndex].value);

        if (typeof prepareA === "string" || typeof prepareB === "string") {
            prepareA = typeof prepareA !== "string" ? String(prepareA) : prepareA;
            prepareB = typeof prepareB !== "string" ? String(prepareB) : prepareB;
        }

        if (prepareA === prepareB) return 0;
        if (prepareA > prepareB) return sortType === "top" ? 1 : -1;
        return sortType === "top" ? -1 : 1;
    });
    temp.rows = arr;
    return temp;
}

// фильтрация таблицы
function filterTableData(sortedFiltredRenderData: TTableValue, filterColumnIndex: number | "", filterOperator: TOperators, filterValue: string) {
    const isFilterActive = filterOperator !== "" && filterColumnIndex !== "";
    if (!isFilterActive) return sortedFiltredRenderData;
    let temp = structuredClone(sortedFiltredRenderData);
    temp.rows = temp.rows.filter((row) => {
        if (!checkFilter(isFilterActive, row, filterColumnIndex, filterValue, filterOperator)) return false;
        return true;
    });

    return temp;
}

// скрытие ненужных ячеек
function excludedColumnsTable(sortedFiltredRenderData: TTableValue, excludeColumns: Set<number>) {
    if (excludeColumns.size === 0) return sortedFiltredRenderData;
    let temp = structuredClone(sortedFiltredRenderData);

    temp.rows = temp.rows.map((row) => {
        const rowItems = row.value.filter((cell, cellIndex) => {
            if (excludeColumns.has(cellIndex)) return false;
            return true;
        });
        return { rowIndex: row.rowIndex, value: rowItems };
    });

    temp.headers = temp.headers.filter((cilumn, index) => {
        if (excludeColumns.has(index)) return false;
        return true;
    });
    return temp;
}

export { checkFilter, sortTableData, filterTableData, excludedColumnsTable };
