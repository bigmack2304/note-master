import React, { useCallback } from "react";
import { tableAdd, tableDelText, deleteSelected } from "./TableFunc";
import { SaveButton_memo_is_equal } from "0-shared/components/SaveButton/SaveButton";
import { TableAddButton_memo_is_equal } from "2-features/components/TableAddButton/TableAddButton";
import { DeleteButton } from "0-shared/components/DeleteButton/DeleteButton";
import { DeleteTextButton } from "0-shared/components/DeleteTextButton/DeleteTextButton";
import { TableColumnsButton_memo_is_equal } from "2-features/components/TableColumnsButton/TableColumnsButton";
import { TableFilterButton_memo_is_equal } from "2-features/components/TableFilterButton/TableFilterButton";
import { ResetButton } from "0-shared/components/ResetButton/ResetButton";
import type { TTableValue } from "0-shared/types/dataSave";
import type { TOperators } from "2-features/components/TableFilterButton/TableFilterButton";

type TTableControlsProps = {
    sortedFiltredRenderData: TTableValue;
    editMode: boolean | undefined;
    onTableSave: () => void;
    savedRenderData: React.MutableRefObject<TTableValue>;
    excludeColumns: Set<number>;
    setExcludeColumns: React.Dispatch<React.SetStateAction<Set<number>>>;
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
    updateView: () => void;
    resetSort: () => void;
    onResetClick: () => void;
};

function TableControls({
    sortedFiltredRenderData,
    editMode,
    onTableSave,
    excludeColumns,
    savedRenderData,
    setExcludeColumns,
    getStateFilter,
    getStateSelect,
    updateView,
    resetSort,
    onResetClick,
    getStateSort,
}: TTableControlsProps) {
    const isTableColumnsButtonActive = excludeColumns.size > 0; // активна-ли опция скрытия колонок
    const { filterColumnIndex, filterOperator, filterValue, resetFilter, setFilterColumnIndex, setFilterOperator, setFilterValue } = getStateFilter();
    const { editSelectColumnIndex, editSelectRowIndex, setEditSelectColumnIndex, setEditSelectRowIndex } = getStateSelect();
    const { sortHeaderIndex } = getStateSort();
    const isFilterActive = filterOperator !== "" && filterColumnIndex !== ""; // активен-ли фильтр
    const isCellsSelect = editSelectColumnIndex.length > 0 || editSelectRowIndex.length > 0; // выбраны-ли какието клеточки в режиме редактирования

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

    return (
        <>
            {editMode && (
                <div className="Table__edit_controls">
                    <SaveButton_memo_is_equal size="small" addClassNames={["Table__control_button"]} title="Сохранить" onClick={onTableSave} />
                    <TableAddButton_memo_is_equal addClassNames={["Table__control_button"]} onCloseSave={onTableAdd} />
                    <DeleteTextButton size="small" title="Отчистить выбранное" addClassNames={["Table__control_button"]} onClick={onTableDelText} disabled={!isCellsSelect} />
                    <DeleteButton size="small" title="Удалить выбранное" addClassNames={["Table__control_button"]} onClick={onDeleteSelected} disabled={!isCellsSelect} />
                </div>
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
        </>
    );
}

export { TableControls };
