import React from "react";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import type { SxProps } from "@mui/material";

// содержимое для DopContextMenu. с вариантом редактирования

type TContextMenuTreeNoteContentProps = {
    onRenameClick?: (e: React.MouseEvent) => void;
    onDeleteClick?: (e: React.MouseEvent) => void;
    onMoveClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
};

const menuItemStyle: SxProps = {
    gap: "10px",
};

/**
 * вариант содержимого для компонента DopContextMenu.
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onRenameClick - вызывается при нажатии на кнопку "Переименовать"
 * @prop onMoveClick - вызывается при нажатии на кнопку "Переместить"
 * @prop onDeleteClick - вызывается при нажатии на кнопку "Удалить"
 */
function ContextMenuTreeNoteContent({ addClassNames = [], onRenameClick, onDeleteClick, onMoveClick }: TContextMenuTreeNoteContentProps) {
    const defaultClassName = "ContextMenuTreeNoteContent";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <>
            <MenuItem className={genClassName} onClick={onRenameClick} sx={menuItemStyle}>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Переименовать</ListItemText>
            </MenuItem>
            <MenuItem className={genClassName} onClick={onMoveClick} sx={menuItemStyle}>
                <ListItemIcon>
                    <DriveFileMoveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Переместить</ListItemText>
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

{
}

export { ContextMenuTreeNoteContent };
