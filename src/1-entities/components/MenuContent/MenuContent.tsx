import React from "react";
import { ListItemIcon, ListItemText, List, ListItemButton, ListSubheader } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import EditNoteIcon from "@mui/icons-material/EditNote";

import type { SxProps } from "@mui/material";

type TProps = {
    onSettingsClick?: (e: React.MouseEvent) => void;
    onNewNoteClick?: (e: React.MouseEvent) => void;
    onSaveClick?: (e: React.MouseEvent) => void;
    onLoadClick?: (e: React.MouseEvent) => void;
};

const listStyle: SxProps = {};

function MenuContent({ onSettingsClick, onNewNoteClick, onSaveClick, onLoadClick }: TProps) {
    return (
        <List sx={listStyle}>
            <ListSubheader component="div" id="nested-list-subheader">
                Меню
            </ListSubheader>
            <ListItemButton onClick={onNewNoteClick}>
                <ListItemIcon>
                    <EditNoteIcon />
                </ListItemIcon>
                <ListItemText>Новая заметка</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onSaveClick}>
                <ListItemIcon>
                    <SaveIcon />
                </ListItemIcon>
                <ListItemText>Сохранить</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onLoadClick}>
                <ListItemIcon>
                    <ImportContactsIcon />
                </ListItemIcon>
                <ListItemText>Загрузить</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onSettingsClick}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Настройки</ListItemText>
            </ListItemButton>
        </List>
    );
}

export { MenuContent };
