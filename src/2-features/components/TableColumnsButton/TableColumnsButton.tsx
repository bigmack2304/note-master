import React, { useState, useEffect, useRef, useCallback } from "react";
import { DopContextMenu } from "1-entities/components/DopContextMenu/DopContextMenu";
import { ColumnsButton } from "0-shared/components/ColumnsButton/ColumnsButton";
import { TextField, Divider, Box, FormGroup, Button } from "@mui/material";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { TTableValue } from "0-shared/types/dataSave";
import { Checkbox_memo_is_equal } from "0-shared/components/Checkbox/Checkbox";
import { deep_object_is_equal } from "0-shared/utils/is_equal";
import "./TableColumnsButton.scss";

interface TTableColumnsButtonProps extends GetProps<typeof ColumnsButton> {
    allColumns: TTableValue["headers"];
    excludeColumns: Set<number>;
    onCloseSave?: (excludeColumns: Set<number>, isChange: boolean) => void;
}

/**
 * кнопка для скрытия колонок таблицы
 * @ дублирует пропсы ColumnsButton
 * @prop allColumns - массив всех колонок таблицы
 * @prop excludeColumns - индексы колонок которые скрыты
 * @prop onCloseSave - вызывается при закрытии всплывающего окна, возвращает сет из индексов колонок которые нужно скрыть
 */
function TableColumnsButton({ addClassNames = [], allColumns, onCloseSave, excludeColumns, ...props }: TTableColumnsButtonProps) {
    const defaultClassName = "TableColumnsButton";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [exColumns, setExColumns] = useState(excludeColumns);
    const [textInputValue, setTextInputValue] = useState("");
    const isContextMenuOpen = Boolean(contextMenuAnchorEl);
    const themeValue = useTemeMode();
    const isChange = useRef(false);

    // нажатие на кнопку, вызов меню
    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setContextMenuAnchorEl(e.currentTarget as HTMLElement);
        props.onClick && props.onClick(e);
    };

    // закрытие меню
    const onContextMenuClose = () => {
        setContextMenuAnchorEl(null);
        onCloseSave && onCloseSave(exColumns, isChange.current);
        isChange.current = false;
        setTextInputValue("");
    };

    // изменения в инпуте поиска
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextInputValue(e.target.value);
    };

    // нажатие на кнопку показать все
    const onShowAll = () => {
        setExColumns(new Set());
        isChange.current = true;
    };

    useEffect(() => {
        setExColumns(excludeColumns);
    }, [excludeColumns]);

    return (
        <>
            <ColumnsButton {...props} addClassNames={[genClassName]} onClick={onButtonClick} title="Скрыть столбцы" />
            <DopContextMenu
                isOpen={isContextMenuOpen}
                anchorEl={contextMenuAnchorEl}
                onClose={onContextMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                addClassNames={["TableColumnsButton__contextMenu"]}
            >
                <TextField
                    label="Поиск столбца"
                    variant="standard"
                    size={"small"}
                    className="TableColumnsButton__textField"
                    value={textInputValue}
                    onChange={onInputChange}
                    autoComplete="off"
                />
                <FormGroup className="TableColumnsButton__checkboxes">
                    {allColumns.map((column, index) => {
                        if (!column.value.includes(textInputValue)) return;

                        const isChecked = !exColumns.has(index);

                        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                            const checked = e.target.checked;
                            isChange.current = true;

                            setExColumns((state) => {
                                const newSet = new Set(state);
                                const ismaxSize = newSet.size === allColumns.length - 1;
                                if (!checked && !newSet.has(index) && !ismaxSize) {
                                    newSet.add(index);
                                }
                                if (checked && newSet.has(index)) {
                                    newSet.delete(index);
                                }

                                return newSet;
                            });
                        };

                        return (
                            <Checkbox_memo_is_equal
                                key={generateHashCode(column.value, index)}
                                label={column.value}
                                checked={isChecked}
                                onChange={onChange}
                                addClassNames={["TableColumnsButton__checkbox"]}
                                size="small"
                            />
                        );
                    })}
                </FormGroup>
                <Divider />
                <Box className="TableColumnsButton__dopControls">
                    <Button variant="contained" onClick={onShowAll} size="small" className="TableColumnsButton__showAll">
                        Показать все
                    </Button>
                </Box>
            </DopContextMenu>
        </>
    );
}

const TableColumnsButton_memo = React.memo(TableColumnsButton);
const TableColumnsButton_memo_is_equal = React.memo(TableColumnsButton, deep_object_is_equal);
export { TableColumnsButton, TableColumnsButton_memo, TableColumnsButton_memo_is_equal };
