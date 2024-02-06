import React from "react";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import type { SxProps } from "@mui/material";

// содержимое для DopContextMenu. с вариантом редактирования

type TContextMenuEditContentProps = {
    onEditClick?: (e: React.MouseEvent) => void;
    onDeleteClick?: (e: React.MouseEvent) => void;
    onClearClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    isClearDisabled?: boolean;
};

const menuItemStyle: SxProps = {
    gap: "10px",
};

/**
 * вариант содержимого для компонента DopContextMenu.
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onEditClick - вызывается при нажатии на кнопку "Редактировать"
 * @prop onDeleteClick - вызывается при нажатии на кнопку "Удалить"
 * @prop onClearClick - вызывается при нажатии на кнопку "Отчистить"
 * @prop isClearDisabled - boolean - disabled для кнопки "Отчистить"
 */
function ContextMenuEditContent({ addClassNames = [], onEditClick, onDeleteClick, onClearClick, isClearDisabled = false }: TContextMenuEditContentProps) {
    const defaultClassName = "ContextMenuEditContent";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <>
            <MenuItem className={genClassName} onClick={onEditClick} sx={menuItemStyle}>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Редактировать</ListItemText>
            </MenuItem>
            <MenuItem className={genClassName} disabled={isClearDisabled} onClick={onClearClick} sx={menuItemStyle}>
                <ListItemIcon>
                    <BrowserNotSupportedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Отчистить</ListItemText>
            </MenuItem>
            <MenuItem className={genClassName} onClick={onDeleteClick} sx={menuItemStyle}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Удалить</ListItemText>
            </MenuItem>
        </>
    );
}

export { ContextMenuEditContent };
