import type { TTableValue } from "0-shared/types/dataSave";

const tableStructure: TTableValue = {
    headers: [
        { value: "значения", colIndex: 0 },
        { value: "числа", colIndex: 1 },
        { value: "числа 2", colIndex: 2 },
        { value: "имена из южного парка", colIndex: 3 },
    ],
    rows: [
        {
            value: [
                { value: "значение 1", colIndex: 0 },
                { value: "1", colIndex: 1 },
                { value: "23", colIndex: 2 },
                { value: "кени", colIndex: 3 },
            ],
            rowIndex: 0,
        },
        {
            value: [
                { value: "значение 4", colIndex: 0 },
                { value: "2", colIndex: 1 },
                { value: "543", colIndex: 2 },
                { value: "батерс", colIndex: 3 },
            ],
            rowIndex: 1,
        },
        {
            value: [
                { value: "значение 2", colIndex: 0 },
                { value: "5", colIndex: 1 },
                { value: "231", colIndex: 2 },
                { value: "тими", colIndex: 3 },
            ],
            rowIndex: 2,
        },
        {
            value: [
                { value: "значение 3", colIndex: 0 },
                { value: "3", colIndex: 1 },
                { value: "5", colIndex: 2 },
                { value: "полотеньчик", colIndex: 3 },
            ],
            rowIndex: 3,
        },
    ],
};

export { tableStructure };
