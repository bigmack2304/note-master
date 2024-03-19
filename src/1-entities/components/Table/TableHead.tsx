import React, {useCallback} from "react";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { TableInput_memo_is_equal } from "0-shared/components/TableInput/TableInput";
import { Checkbox_memo_is_equal } from "0-shared/components/Checkbox/Checkbox";
import { TableSortButton_is_equal } from "0-shared/components/TableSortButton/TableSortButton";
import { Box, Typography } from "@mui/material";
import * as style from "./TableStyle";
import type { TTableValue } from "0-shared/types/dataSave";

type TTableHeadProps = {
    sortedFiltredRenderData: TTableValue;
    editMode: boolean | undefined;
    editSelectColumnIndex: number[];
    onCellValueBlur: () => void;
    onCellValueUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEditSelectTable: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    sortHeaderIndex: string;
    getStateSort: () => {
        sortHeaderIndex: string;
        sortHeaderType: "top" | "bottom";
        setSortHeaderType: React.Dispatch<React.SetStateAction<"top" | "bottom">>;
        setSortHeaderIndex: React.Dispatch<React.SetStateAction<string>>;
    };
    sortHeaderType: "top" | "bottom";
};

function TableHead({
    sortedFiltredRenderData,
    editMode,
    editSelectColumnIndex,
    onCellValueBlur,
    onCellValueUpdate,
    onEditSelectTable,
    sortHeaderIndex,
    getStateSort,
    sortHeaderType,
}: TTableHeadProps) {
    const temeValue = useTemeMode();
    const {setSortHeaderIndex, setSortHeaderType} = getStateSort();


    // нажатие на какуюто кнопку сортировки в колонках
    const onTableSortButton = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const index = (e.currentTarget as HTMLButtonElement).dataset.header_index;
        const iconType = (e.currentTarget as HTMLButtonElement).dataset.icon as "top" | "bottom";

        if (!index || !iconType) return;
        setSortHeaderIndex(index);
        setSortHeaderType(iconType === "top" ? "bottom" : "top");
    }, []);

    return (
        <>
            {sortedFiltredRenderData.headers.length > 0 && (
                <tr>
                    {/* селекторы колонок в режиме редактирования */}
                    {editMode && <th className="Table__header--edit"></th>}
                    {sortedFiltredRenderData.headers.map((hValue) => {
                        let cellClass = "Table__header";
                        if (editMode && editSelectColumnIndex.includes(hValue.colIndex)) {
                            cellClass = cellClass + " Table__cell_select";
                        }
                        return (
                            <Box component="th" key={generateHashCode(hValue.value, hValue.colIndex)} className={cellClass} sx={style.cell(temeValue)}>
                                <div className="Table__header_inner_container">
                                    {editMode ? (
                                        <TableInput_memo_is_equal
                                            hValue={hValue}
                                            onBlur={onCellValueBlur}
                                            onChange={onCellValueUpdate}
                                            className="Table__header_text_input"
                                            inputProps={{ "data-header_index": hValue.colIndex }}
                                            key={generateHashCode(`${hValue.value}-${hValue.colIndex}`)}
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
                                        <TableSortButton_is_equal
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
        </>
    );
}

export { TableHead };
