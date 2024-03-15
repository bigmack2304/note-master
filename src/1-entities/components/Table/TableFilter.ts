import type { TOperators } from "2-features/components/TableFilterButton/TableFilterButton";

function checkFilter(isFilterActive: boolean, row: string[], filterColumnIndex: number | "", filterValue: string, filterOperator: TOperators) {
    if (isFilterActive) {
        if (filterColumnIndex === "") return true; // вообще этого кейса никогда не должно быть при текущем использовании, но навсякий случай (еще чтоб ts не ругался)

        const columnValue = row[filterColumnIndex];
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

export { checkFilter };
