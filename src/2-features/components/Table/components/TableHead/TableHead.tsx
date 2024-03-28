import React, { useCallback } from "react";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { TableInput_memo_is_equal } from "../TableInput/TableInput";
import { Checkbox_memo_is_equal } from "0-shared/components/Checkbox/Checkbox";
import { TableSortButton_memo_is_equal } from "0-shared/components/TableSortButton/TableSortButton";
import { Box, Typography } from "@mui/material";
import { UnselectButton } from "0-shared/components/Unselect/UnselectButton";
import * as style from "./../../TableStyle";
import type { TTableValue, TBodyComponentTable, TTableRowColumnItem } from "0-shared/types/dataSave";

type TTableHeadProps = {
    sortedFiltredRenderData: TTableValue;
    editMode: boolean | undefined;
    tableViewControls?: TBodyComponentTable["viewButtons"];
    getStateSelect: () => {
        editSelectColumnIndex: number[];
        editSelectRowIndex: number[];
        setEditSelectColumnIndex: React.Dispatch<React.SetStateAction<number[]>>;
        setEditSelectRowIndex: React.Dispatch<React.SetStateAction<number[]>>;
    };
    onCellValueFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    onCellValueBlur: (e: React.FocusEvent) => void;
    onCellValueUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEditSelectTable: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    getStateSort: () => {
        sortHeaderIndex: string;
        sortHeaderType: "top" | "bottom";
        setSortHeaderType: React.Dispatch<React.SetStateAction<"top" | "bottom">>;
        setSortHeaderIndex: React.Dispatch<React.SetStateAction<string>>;
    };
};

/**
 * блок с заголовками таблицы
 */
function TableHead({
    sortedFiltredRenderData,
    editMode,
    getStateSelect,
    onCellValueBlur,
    onCellValueUpdate,
    onEditSelectTable,
    getStateSort,
    onCellValueFocus,
    tableViewControls,
}: TTableHeadProps) {
    const temeValue = useTemeMode();
    const { setSortHeaderIndex, setSortHeaderType, sortHeaderIndex, sortHeaderType } = getStateSort();
    const { editSelectColumnIndex, editSelectRowIndex, setEditSelectColumnIndex, setEditSelectRowIndex } = getStateSelect();

    // нажатие на какуюто кнопку сортировки в колонках
    const onTableSortButton = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const index = (e.currentTarget as HTMLButtonElement).dataset.header_index;
        const iconType = (e.currentTarget as HTMLButtonElement).dataset.icon as "top" | "bottom";

        if (!index || !iconType) return;
        setSortHeaderIndex(index);
        setSortHeaderType(iconType === "top" ? "bottom" : "top");
    }, []);

    const onUnselectButtonClick = () => {
        setEditSelectColumnIndex([]);
        setEditSelectRowIndex([]);
    };

    const renderSortButton = useCallback((hValue: TTableRowColumnItem) => {
        return (
            <TableSortButton_memo_is_equal
                addClassNames={["Table__header_sort_button"]}
                dataSet={[{ name: "header_index", value: String(hValue.colIndex) }]}
                isActive={sortHeaderIndex === String(hValue.colIndex)}
                icon={sortHeaderIndex === String(hValue.colIndex) ? sortHeaderType : "top"}
                onClick={onTableSortButton}
            />
        );
    }, []);

    return (
        <>
            {sortedFiltredRenderData.headers.length > 0 && (
                <tr>
                    {/* селекторы колонок в режиме редактирования */}
                    {editMode && (
                        <th className="Table__header--edit">
                            <UnselectButton
                                size="small"
                                disabled={editSelectRowIndex.length === 0 && editSelectColumnIndex.length === 0}
                                title="Отменить выделение"
                                onClick={onUnselectButtonClick}
                            />
                        </th>
                    )}
                    {sortedFiltredRenderData.headers.map((hValue) => {
                        let cellClass = "Table__header";
                        if (editMode && editSelectColumnIndex.includes(hValue.colIndex)) {
                            cellClass = cellClass + " Table__cell_select";
                        }
                        return (
                            <Box component="th" key={generateHashCode(String(hValue.colIndex))} className={cellClass} sx={style.cell(temeValue)}>
                                <div className="Table__header_inner_container">
                                    {editMode ? (
                                        <TableInput_memo_is_equal
                                            hValue={hValue}
                                            onBlur={onCellValueBlur}
                                            onFocus={onCellValueFocus}
                                            onChange={onCellValueUpdate}
                                            className="Table__header_text_input"
                                            inputProps={{ "data-header_index": hValue.colIndex }}
                                            key={generateHashCode(String(hValue.colIndex))}
                                        />
                                    ) : (
                                        <Typography className="Table__header_text">{hValue.value}</Typography>
                                    )}
                                    <div className="Table__header_controls_container">
                                        {editMode && (
                                            <Checkbox_memo_is_equal
                                                size="small"
                                                addClassNames={["Table__editable_select_column"]}
                                                dataSet={[{ name: "header_index", value: String(hValue.colIndex) }]}
                                                onChange={onEditSelectTable}
                                                checked={editSelectColumnIndex.includes(hValue.colIndex)}
                                            />
                                        )}
                                        {/* {!editMode && tableViewControls && (
                                            <TableSortButton_memo_is_equal
                                                addClassNames={["Table__header_sort_button"]}
                                                dataSet={[{ name: "header_index", value: String(hValue.colIndex) }]}
                                                isActive={sortHeaderIndex === String(hValue.colIndex)}
                                                icon={sortHeaderIndex === String(hValue.colIndex) ? sortHeaderType : "top"}
                                                onClick={onTableSortButton}
                                            />
                                        )} */}
                                        {!editMode ? tableViewControls ? renderSortButton(hValue) : <></> : renderSortButton(hValue)}
                                    </div>
                                </div>
                            </Box>
                        );
                    })}
                </tr>
            )}
        </>
    );
}

export { TableHead };
