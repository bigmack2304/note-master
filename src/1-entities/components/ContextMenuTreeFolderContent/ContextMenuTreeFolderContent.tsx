import React from "react";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import type { SxProps } from "@mui/material";

// содержимое для DopContextMenu. с вариантом редактирования

type TContextMenuTreeFolderContentProps = {
    onRenameClick?: (e: React.MouseEvent) => void;
    onNewNoteClick?: (e: React.MouseEvent) => void;
    onNewFolderClick?: (e: React.MouseEvent) => void;
    onDeleteClick?: (e: React.MouseEvent) => void;
    onMoveClick?: (e: React.MouseEvent) => void;
    isDelDisabled?: boolean;
    isRenDisabled?: boolean;
    isMowDisabled?: boolean;
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
 * @prop onNewFolderClick - вызывается при нажатии на кнопку "Добавить папку"
 * @prop onNewNoteClick - вызывается при нажатии на кнопку "Добавить заметку"
 * @prop onMoveClick - вызывается при нажатии на кнопку "Переместить"
 * @prop isDelDisabled - будетли кнопка удалять не доступна?
 */
function ContextMenuTreeFolderContent({
    addClassNames = [],
    onRenameClick,
    onDeleteClick,
    onNewNoteClick,
    onNewFolderClick,
    onMoveClick,
    isDelDisabled = false,
    isRenDisabled = false,
    isMowDisabled = false,
}: TContextMenuTreeFolderContentProps) {
    const defaultClassName = "ContextMenuTreeFolderContent";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <>
            <MenuItem className={genClassName} onClick={onNewNoteClick} sx={menuItemStyle}>
                <ListItemIcon>
                    <NoteAddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Добавить заметку</ListItemText>
            </MenuItem>
            <MenuItem className={genClassName} onClick={onNewFolderClick} sx={menuItemStyle}>
                <ListItemIcon>
                    <CreateNewFolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Добавить папку</ListItemText>
            </MenuItem>
            <MenuItem className={genClassName} onClick={onRenameClick} sx={menuItemStyle} disabled={isRenDisabled}>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Переименовать</ListItemText>
            </MenuItem>
            <MenuItem className={genClassName} onClick={onMoveClick} sx={menuItemStyle} disabled={isMowDisabled}>
                <ListItemIcon>
                    <DriveFileMoveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Переместить</ListItemText>
            </MenuItem>
            <MenuItem className={genClassName} onClick={onDeleteClick} sx={menuItemStyle} disabled={isDelDisabled}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Удалить</ListItemText>
            </MenuItem>
        </>
    );
}

export { ContextMenuTreeFolderContent };
