import React from "react";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { TableInput_memo_is_equal } from "../TableInput/TableInput";
import { Checkbox_memo_is_equal } from "0-shared/components/Checkbox/Checkbox";
import { Box, Typography } from "@mui/material";
import * as style from "./../../TableStyle";
import type { TTableValue } from "0-shared/types/dataSave";

type TTableBodyProps = {
    sortedFiltredRenderData: TTableValue;
    editMode: boolean | undefined;
    onCellValueBlur: (e: React.FocusEvent) => void;
    onCellValueUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEditSelectTable: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    getStateSelect: () => {
        editSelectColumnIndex: number[];
        editSelectRowIndex: number[];
        setEditSelectColumnIndex: React.Dispatch<React.SetStateAction<number[]>>;
        setEditSelectRowIndex: React.Dispatch<React.SetStateAction<number[]>>;
    };
    onCellValueFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
};

/**
 * блок с содержимым таблицы, невключая неголовки
 */
function TableBody({ sortedFiltredRenderData, editMode, onCellValueBlur, onCellValueUpdate, onEditSelectTable, getStateSelect, onCellValueFocus }: TTableBodyProps) {
    const temeValue = useTemeMode();
    const { editSelectRowIndex, editSelectColumnIndex } = getStateSelect();

    return (
        <>
            {sortedFiltredRenderData.rows.length > 0 &&
                sortedFiltredRenderData.rows.map((row) => {
                    // рендер всей строки
                    return (
                        <Box component={"tr"} className="Table__row_body" key={generateHashCode(String(row.rowIndex))} sx={style.rowBody(temeValue)}>
                            {/* селекторы строк в режиме редактирования */}
                            {editMode && (
                                <td className="Table__body--edit">
                                    <Checkbox_memo_is_equal
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
                                        key={generateHashCode(`${row.rowIndex}-${itemValue.colIndex}-${itemValue.value}`)}
                                        data-row_index={row.rowIndex}
                                        data-column_index={itemValue.colIndex}
                                        className={cellClass}
                                        component="td"
                                        sx={style.cell(temeValue)}
                                    >
                                        <div className="Table__body_inner_container">
                                            {editMode ? (
                                                <TableInput_memo_is_equal
                                                    hValue={itemValue}
                                                    onBlur={onCellValueBlur}
                                                    onChange={onCellValueUpdate}
                                                    onFocus={onCellValueFocus}
                                                    className="Table__body_text_input"
                                                    inputProps={{ "data-column_index": itemValue.colIndex, "data-row_index": row.rowIndex }}
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
        </>
    );
}

export { TableBody };
