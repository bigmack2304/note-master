import React, { useState, useEffect } from "react";
import { Typography, Box, TextField } from "@mui/material";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import { TableSortButton } from "0-shared/components/TableSortButton/TableSortButton";
import type { TTableValue } from "0-shared/types/dataSave";
import "./Table.scss";

type TTableProps = {
    addClassNames?: string[];
    tableRenderData: TTableValue;
    editMode?: boolean;
    // sortHeaderIndex?: number;
    // sortHeaderType?: "top" | "bottom";
    // onHeadSortClick?: (index: string, icon: string) => void;
    tableDesc?: string;
};

/**
 *
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function Table({ addClassNames = [], tableRenderData, editMode, tableDesc = "" }: TTableProps) {
    const [prepareRenderData, setPrepareRenderData] = useState(tableRenderData);
    const [sortHeaderIndex, setSortHeaderIndex] = useState<string>("");
    const [sortHeaderType, setSortHeaderType] = useState<"top" | "bottom">("top");

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

    useEffect(() => {
        setPrepareRenderData(tableRenderData);
        setSortHeaderIndex("");
        setSortHeaderType("top");
    }, [tableRenderData]);

    calcClassName();

    return (
        <div className={genClassName}>
            {editMode && <div className="Table__edit_controls"></div>}
            <div className="Table__view_controls"></div>
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
                            return (
                                <tr key={generateHashCode(String(rowIndex), rowIndex)}>
                                    {/* рендер отденльной колонки строки */}
                                    {row.map((itemValue, columnIndex) => {
                                        return (
                                            <td key={generateHashCode(itemValue, columnIndex)} data-row_index={rowIndex} data-column_index={columnIndex} className="Table__body">
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
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}

export { Table };
