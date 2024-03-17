import React, { useState, useEffect, useId, useRef } from "react";
import { DopContextMenu } from "1-entities/components/DopContextMenu/DopContextMenu";
import { FilterButton } from "0-shared/components/FilterButton/FilterButton";
import { TextField, Divider, Box, FormGroup, FormControlLabel, Checkbox, Button, MenuItem, FormControl, InputLabel, NativeSelect, Select } from "@mui/material";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { TTableValue } from "0-shared/types/dataSave";
import type { SelectChangeEvent } from "@mui/material/Select";
import * as style from "./TableFilterButtonStyle";
import "./TableFilterButton.scss";

interface TTableFilterButtonProps extends GetProps<typeof FilterButton> {
    allColumns: TTableValue["headers"];
    filterColumnIndex: number | "";
    filterOperator: TOperators;
    filterValue: string;
    onCloseSave?: (filterColumnIndex: number | "", filterOperator: TOperators, filterValue: string, isChange: boolean) => void;
}

type TOperators = "" | ">" | "<" | ">=" | "<=" | "=" | "'т'.." | "..'т'.." | "..'т'";

/**
 * кнопка для фильтрации колонок таблицы
 * @ дублирует пропсы ColumnsButton
 * @prop allColumns - массив всех колонок таблицы
 * @prop onCloseSave - вызывается при закрытии всплывающего окна, возвращает сет из индексов колонок которые нужно скрыть
 */
function TableFilterButton({ addClassNames = [], allColumns, onCloseSave, filterColumnIndex, filterOperator, filterValue, ...props }: TTableFilterButtonProps) {
    const defaultClassName = "TableFilterButton";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | "">(filterColumnIndex);
    const [selectedOperator, setSelectedOperator] = useState<TOperators>(filterOperator);
    const [inputValue, setInputValue] = useState(filterValue);
    const isContextMenuOpen = Boolean(contextMenuAnchorEl);
    const selectColumnId = useId();
    const selectOperatorId = useId();
    const isChange = useRef(false);
    const themeValue = useTemeMode();

    // нажатие на кнопку фильтра
    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setContextMenuAnchorEl(e.currentTarget as HTMLElement);
        props.onClick && props.onClick(e);
    };

    // закрытие меню фильтра
    const onContextMenuClose = () => {
        setContextMenuAnchorEl(null);

        onCloseSave && onCloseSave(selectedColumnIndex, selectedOperator, inputValue, isChange.current);

        isChange.current = false;
    };

    // изменения в фильтруемой колонке
    const onSelectColumnIndex = (e: SelectChangeEvent<typeof selectedColumnIndex>) => {
        if (selectedOperator !== "" && e.target.value !== "") isChange.current = true;
        setSelectedColumnIndex(Number(e.target.value));
    };

    // изменение оператора
    const onSelectOperatorIndex = (e: SelectChangeEvent<typeof selectedOperator>) => {
        if (e.target.value !== "" && selectedColumnIndex !== "") isChange.current = true;
        setSelectedOperator(e.target.value as TOperators);
    };

    // изменение в сравнивающем значении
    const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedOperator !== "" && selectedColumnIndex !== "") isChange.current = true;
        setInputValue(e.target.value);
    };

    const onReset = () => {
        isChange.current = true;
        setSelectedColumnIndex("");
        setSelectedOperator("");
        setInputValue("");
    };

    useEffect(() => {
        setSelectedColumnIndex(filterColumnIndex);
    }, [filterColumnIndex]);

    useEffect(() => {
        setSelectedOperator(filterOperator);
    }, [filterOperator]);

    useEffect(() => {
        setInputValue(filterValue);
    }, [filterValue]);

    return (
        <>
            <FilterButton {...props} addClassNames={[genClassName]} onClick={onButtonClick} title="Фильтр" />
            <DopContextMenu
                isOpen={isContextMenuOpen}
                anchorEl={contextMenuAnchorEl}
                onClose={onContextMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                addClassNames={["TableFilterButton__contextMenu"]}
            >
                <div className="TableFilterButton__controls_container">
                    <FormControl className="TableFilterButton__formControl">
                        <InputLabel id={selectColumnId}>Колонка</InputLabel>
                        <Select
                            labelId={selectColumnId}
                            value={selectedColumnIndex}
                            label="Колонка"
                            variant="standard"
                            onChange={onSelectColumnIndex}
                            required
                            className="TableFilterButton__select"
                            size="small"
                        >
                            {allColumns.map((column, index) => {
                                return (
                                    <MenuItem key={generateHashCode(column.value, index)} value={column.colIndex}>
                                        {column.value}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <Divider />
                    <FormControl className="TableFilterButton__formControl">
                        <InputLabel id={selectOperatorId}>Оператор</InputLabel>
                        <Select
                            labelId={selectOperatorId}
                            value={selectedOperator}
                            label="Оператор"
                            variant="standard"
                            onChange={onSelectOperatorIndex}
                            required
                            size="small"
                            className="TableFilterButton__select TableFilterButton__select_operator"
                        >
                            <MenuItem value={">"} title="меньше">
                                {">"}
                            </MenuItem>
                            <MenuItem value={"<"} title="больше">
                                {"<"}
                            </MenuItem>
                            <MenuItem value={"="} title="равно">
                                {"="}
                            </MenuItem>
                            <MenuItem value={">="} title="меньше или равно">
                                {">="}
                            </MenuItem>
                            <MenuItem value={"<="} title="больше или равно">
                                {"<="}
                            </MenuItem>
                            <MenuItem value={"'т'.."} title="начинается с">
                                {"'т'.."}
                            </MenuItem>
                            <MenuItem value={"..'т'.."} title="содержит">
                                {"..'т'.."}
                            </MenuItem>
                            <MenuItem value={"..'т'"} title="заканчивается на">
                                {"..'т'"}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <Divider />
                    <TextField
                        variant="standard"
                        size="small"
                        label="Значение"
                        className="TableFilterButton__valueField"
                        autoComplete="off"
                        value={inputValue}
                        onChange={onInputValueChange}
                    />
                    <Divider />
                    <Box className="TableFilterButton__dopControls">
                        <Button variant="contained" onClick={onReset} size="small" className="TableFilterButton__reset">
                            Сброс
                        </Button>
                    </Box>
                </div>
            </DopContextMenu>
        </>
    );
}

export { TableFilterButton };
export type { TOperators };
