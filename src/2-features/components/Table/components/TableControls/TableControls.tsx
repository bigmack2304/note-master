import React, { useCallback, useEffect } from "react";
import { tableAdd, tableDelText, deleteSelected } from "../../utils/TableFunc";
import { SaveButton_memo_is_equal } from "0-shared/components/SaveButton/SaveButton";
import { TableAddButton_memo_is_equal } from "../TableAddButton/TableAddButton";
import { DeleteButton } from "0-shared/components/DeleteButton/DeleteButton";
import { DeleteTextButton } from "0-shared/components/DeleteTextButton/DeleteTextButton";
import { TableColumnsButton_memo_is_equal } from "../TableColumnsButton/TableColumnsButton";
import { TableFilterButton_memo_is_equal } from "../TableFilterButton/TableFilterButton";
import { ResetButton } from "0-shared/components/ResetButton/ResetButton";
import { TextField } from "@mui/material";
import { cellValueUpdate } from "../../utils/TableFunc";
import type { TTableValue, TBodyComponentTable } from "0-shared/types/dataSave";
import type { TOperators } from "../TableFilterButton/TableFilterButton";
import type { TActiveCellData } from "../../commonTypes/types";
import { MiuMultiInputCustom } from "0-shared/components/MiuMultiInputCustom/MiuMultiInputCustom";

type TTableControlsProps = {
    sortedFiltredRenderData: TTableValue;
    editMode: boolean | undefined;
    tableViewControls: TBodyComponentTable["viewButtons"];
    onSave?: (newValue: TTableValue) => void;
    savedRenderData: React.MutableRefObject<TTableValue>;
    getStateExcludeColumns: () => {
        excludeColumns: Set<number>;
        setExcludeColumns: React.Dispatch<React.SetStateAction<Set<number>>>;
    };
    getStateFilter: () => {
        filterColumnIndex: number | "";
        filterOperator: TOperators;
        filterValue: string;
        setFilterColumnIndex: React.Dispatch<React.SetStateAction<number | "">>;
        setFilterOperator: React.Dispatch<React.SetStateAction<TOperators>>;
        setFilterValue: React.Dispatch<React.SetStateAction<string>>;
        resetFilter: () => void;
    };
    getStateSelect: () => {
        editSelectColumnIndex: number[];
        editSelectRowIndex: number[];
        setEditSelectColumnIndex: React.Dispatch<React.SetStateAction<number[]>>;
        setEditSelectRowIndex: React.Dispatch<React.SetStateAction<number[]>>;
    };
    getStateSort: () => {
        sortHeaderIndex: string;
        sortHeaderType: "top" | "bottom";
        setSortHeaderType: React.Dispatch<React.SetStateAction<"top" | "bottom">>;
        setSortHeaderIndex: React.Dispatch<React.SetStateAction<string>>;
    };
    getRefsInputDubleCellValue: () => {
        inputDubleCellValue: React.MutableRefObject<HTMLInputElement | undefined>;
        focusCellData: React.MutableRefObject<TActiveCellData>;
    };
    updateView: () => void;
    resetSort: () => void;
    onResetClick: () => void;
};
/**
 * блок с кнопками в таблице
 */
function TableControls({
    sortedFiltredRenderData,
    editMode,
    getStateExcludeColumns,
    savedRenderData,
    getStateFilter,
    getStateSelect,
    updateView,
    resetSort,
    onResetClick,
    getStateSort,
    getRefsInputDubleCellValue,
    onSave,
    tableViewControls,
}: TTableControlsProps) {
    const { excludeColumns, setExcludeColumns } = getStateExcludeColumns();
    const isTableColumnsButtonActive = excludeColumns.size > 0; // активна-ли опция скрытия колонок
    const { filterColumnIndex, filterOperator, filterValue, resetFilter, setFilterColumnIndex, setFilterOperator, setFilterValue } = getStateFilter();
    const { editSelectColumnIndex, editSelectRowIndex, setEditSelectColumnIndex, setEditSelectRowIndex } = getStateSelect();
    const { sortHeaderIndex } = getStateSort();
    const isFilterActive = filterOperator !== "" && filterColumnIndex !== ""; // активен-ли фильтр
    const isCellsSelect = editSelectColumnIndex.length > 0 || editSelectRowIndex.length > 0; // выбраны-ли какието клеточки в режиме редактирования
    const { inputDubleCellValue, focusCellData } = getRefsInputDubleCellValue();

    // нажатие на кнопку сохранить
    const onTableSave = useCallback(() => {
        onSave && onSave(savedRenderData.current);
    }, []);

    // нажатие на кнопку добавления строки или колонки
    const onTableAdd = useCallback((type: "row" | "column", amount: number) => {
        tableAdd({ amount, resetFilter, savedRenderData, setExcludeColumns, type, updateView });
    }, []);

    // нажатие на кнопку отчистить
    const onTableDelText = () => {
        tableDelText({ editSelectColumnIndex, editSelectRowIndex, savedRenderData, sortedFiltredRenderData, updateView });
    };

    // нажатие на кнопку удалить выбранное
    const onDeleteSelected = () => {
        deleteSelected({
            editSelectColumnIndex,
            editSelectRowIndex,
            filterColumnIndex,
            resetFilter,
            resetSort,
            savedRenderData,
            setEditSelectColumnIndex,
            setEditSelectRowIndex,
            sortHeaderIndex,
            updateView,
        });
    };

    // закритие меню показа колонок
    const onTableColumnsButtonClose = useCallback((excColumns: Set<number>, isChange: boolean) => {
        if (!isChange) return;
        if (isFilterActive && [...excColumns.values()].includes(filterColumnIndex)) {
            resetFilter();
        }

        setEditSelectColumnIndex([]);
        setExcludeColumns(excColumns);
    }, []);

    // закрытие меню фильтра
    const onTableFilterButtonClose = useCallback((filterColumnIndex: number | "", filterOperator: TOperators, filterValue: string, isChange: boolean) => {
        if (!isChange) return;
        setFilterColumnIndex(filterColumnIndex);
        setFilterOperator(filterOperator);
        setFilterValue(filterValue);
        setEditSelectRowIndex([]);
    }, []);

    const onInputBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (!e.relatedTarget?.className.includes("MuiInputBase-input")) {
            e.target.value = "";
            const dubleInput = focusCellData.current.inputDubleCellValue.current;
            const activeCell = focusCellData.current.targetActiveCell.current;
            if (dubleInput) dubleInput.disabled = true;
            if (activeCell) {
                activeCell.classList.remove("Mui-focused");
            }
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const value = e.target.value;
        const activeCell = focusCellData.current.targetActiveCell.current;

        if (activeCell) {
            activeCell.value = value;
            activeCell.style.height = ``; //TODO: сброс делать обязательно, иначе высота не сможет уменьшатся
            activeCell.style.height = `${activeCell.scrollHeight}px`;
            cellValueUpdate({ focusCellData, savedRenderData });
        } else {
            e.target.value = "";
        }
    };

    useEffect(() => {
        if (inputDubleCellValue.current) inputDubleCellValue.current.disabled = true;
    }, []);

    return (
        <>
            <div className="Table__controls">
                {editMode && (
                    <>
                        {/* <TextField
                            variant="outlined"
                            size="small"
                            multiline
                            rows={5}
                            inputProps={{ ref: inputDubleCellValue, className: "Table_inputValueDubleCell" }}
                            onBlur={onInputBlur}
                            onChange={onInputChange}
                            className="Table__inputDoubleValue"
                        /> */}
                        <MiuMultiInputCustom
                            rows={6}
                            onBlur={onInputBlur}
                            onChange={onInputChange}
                            addClassNames={["Table__inputDoubleValue"]}
                            addInputClassNames={["Table_inputValueDubleCell"]}
                            inputProps={{ ref: inputDubleCellValue }}
                        />

                        <div className="Table__edit_controls">
                            <SaveButton_memo_is_equal size="small" addClassNames={["Table__control_button"]} title="Сохранить" onClick={onTableSave} />
                            <TableAddButton_memo_is_equal addClassNames={["Table__control_button"]} onCloseSave={onTableAdd} />
                            <DeleteTextButton
                                size="small"
                                title="Отчистить выбранное"
                                addClassNames={["Table__control_button"]}
                                onClick={onTableDelText}
                                disabled={!isCellsSelect}
                            />
                            <DeleteButton size="small" title="Удалить выбранное" addClassNames={["Table__control_button"]} onClick={onDeleteSelected} disabled={!isCellsSelect} />
                        </div>
                    </>
                )}
                <div className="Table__view_controls">
                    <TableColumnsButton_memo_is_equal
                        size="small"
                        allColumns={savedRenderData.current.headers}
                        excludeColumns={excludeColumns}
                        onCloseSave={onTableColumnsButtonClose}
                        isActive={isTableColumnsButtonActive}
                        addClassNames={["Table__control_button"]}
                    />
                    <TableFilterButton_memo_is_equal
                        size="small"
                        allColumns={sortedFiltredRenderData.headers}
                        onCloseSave={onTableFilterButtonClose}
                        filterColumnIndex={filterColumnIndex}
                        filterOperator={filterOperator}
                        filterValue={filterValue}
                        isActive={isFilterActive}
                        addClassNames={["Table__control_button"]}
                    />
                    <ResetButton onClick={onResetClick} title="Сброс фильтров" />
                </div>
            </div>
        </>
    );
}

export { TableControls };
