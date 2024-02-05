import React from "react";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { SxProps } from "@mui/material";

// содержимое для DopContextMenu. с вариантом редактирования

type TContextMenuTreeFolderContentProps = {
    onRenameClick?: (e: React.MouseEvent) => void;
    onDeleteClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
};

const menuItemStyle: SxProps = {
    gap: "10px",
};

/**
 * вариант содержимого для компонента DopContextMenu.
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onRenameClick - вызывается при нажатии на кнопку "Переименовать"
 * @prop onDeleteClick - вызывается при нажатии на кнопку "Удалить"
 */
function ContextMenuTreeFolderContent({ addClassNames = [], onRenameClick, onDeleteClick }: TContextMenuTreeFolderContentProps) {
    const defaultClassName = "ContextMenuTreeFolderContent";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <>
            <MenuItem className={genClassName} onClick={onRenameClick} sx={menuItemStyle}>
                <EditIcon fontSize="small" />
                Переименовать
            </MenuItem>
            <MenuItem className={genClassName} onClick={onDeleteClick} sx={menuItemStyle}>
                <DeleteIcon fontSize="small" />
                Удалить
            </MenuItem>
        </>
    );
}

export { ContextMenuTreeFolderContent };
