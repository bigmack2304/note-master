import React, { useState } from "react";
import { DopContextMenu } from "1-entities/components/DopContextMenu/DopContextMenu";
import { MenuItem, ListItemText, Input } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";
import { AddButton } from "0-shared/components/AddButton/AddButton";
import "./TableAddButton.scss";

interface TTableAddButtonProps extends GetProps<typeof AddButton> {
    onCloseSave?: (type: "row" | "column", amount: number) => void;
}

/**
 * кнопка для добавления колонок или строк в таблицу
 * @ дублирует пропсы AddButton
 * @prop onCloseSave - вызывается при закрытии всплывающего окна, возвращает сет из индексов колонок которые нужно скрыть
 */
function TableAddButton({ addClassNames = [], onCloseSave, ...props }: TTableAddButtonProps) {
    const defaultClassName = "TableAddButton";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [inputRowValue, setInputRowValue] = useState<number>(1);
    const [inputColValue, setInputColValue] = useState<number>(1);
    const isContextMenuOpen = Boolean(contextMenuAnchorEl);

    // нажатие на кнопку, вызов меню
    const onButtonClick = (e: React.MouseEvent) => {
        setContextMenuAnchorEl(e.currentTarget as HTMLElement);
        props.onClick && props.onClick(e);
    };

    // закрытие меню
    const onContextMenuClose = () => {
        setContextMenuAnchorEl(null);
        setInputRowValue(1);
        setInputColValue(1);
    };

    // добавление колонок
    const onAddColumn = () => {
        setContextMenuAnchorEl(null);
        let validateInputColValue = inputColValue > 0 ? (inputColValue <= 100 ? inputColValue : 100) : 1;
        onCloseSave && onCloseSave("column", validateInputColValue);
        onContextMenuClose();
    };

    // добавление строк
    const onAddRow = () => {
        setContextMenuAnchorEl(null);
        let validateInputRowValue = inputRowValue > 0 ? (inputRowValue <= 100 ? inputRowValue : 100) : 1;
        onCloseSave && onCloseSave("row", validateInputRowValue);
        onContextMenuClose();
    };

    const onInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
    };

    const onInputColChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setInputColValue(Number(e.target.value));
    };

    const onInputRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setInputRowValue(Number(e.target.value));
    };

    return (
        <>
            <AddButton size="small" title="Добавить" addClassNames={[genClassName]} onClick={onButtonClick} {...props} />
            <DopContextMenu
                isOpen={isContextMenuOpen}
                anchorEl={contextMenuAnchorEl}
                onClose={onContextMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                addClassNames={["TableAddButton__contextMenu"]}
            >
                <MenuItem onClick={onAddColumn}>
                    <ListItemText>Добавить колонку</ListItemText>
                    <Input
                        inputProps={{ min: 1, max: 100, type: "number" }}
                        value={inputColValue}
                        className="TableAddButton__number_input"
                        onClick={onInputClick}
                        onChange={onInputColChange}
                    />
                </MenuItem>
                <MenuItem onClick={onAddRow}>
                    <ListItemText>Добавить строку</ListItemText>
                    <Input
                        inputProps={{ min: 1, max: 100, type: "number" }}
                        value={inputRowValue}
                        className="TableAddButton__number_input"
                        onClick={onInputClick}
                        onChange={onInputRowChange}
                    />
                </MenuItem>
            </DopContextMenu>
        </>
    );
}

export { TableAddButton };
