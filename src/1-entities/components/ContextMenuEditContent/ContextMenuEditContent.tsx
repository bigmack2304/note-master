import React from "react";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { SxProps } from "@mui/material";

// содержимое для DopContextMenu. с вариантом редактирования

type TContextMenuEditContentProps = {
    onEditClick?: (e: React.MouseEvent) => void;
    onDeleteClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    isDeleteDisabled?: boolean;
};

const menuItemStyle: SxProps = {
    gap: "10px",
};

function ContextMenuEditContent({ addClassNames = [], onEditClick, onDeleteClick, isDeleteDisabled = false }: TContextMenuEditContentProps) {
    const defaultClassName = "ContextMenuEditContent";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <>
            <MenuItem className={genClassName} onClick={onEditClick} sx={menuItemStyle}>
                <EditIcon fontSize="small" />
                Редактировать
            </MenuItem>
            <MenuItem className={genClassName} disabled={isDeleteDisabled} onClick={onDeleteClick} sx={menuItemStyle}>
                <DeleteIcon fontSize="small" />
                Удалить
            </MenuItem>
        </>
    );
}

export { ContextMenuEditContent };
