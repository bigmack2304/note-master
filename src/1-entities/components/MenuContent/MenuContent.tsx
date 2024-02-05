import React from "react";
import { ListItemIcon, ListItemText, List, ListItemButton, ListSubheader, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import EditNoteIcon from "@mui/icons-material/EditNote";
import InfoIcon from "@mui/icons-material/Info";

import type { SxProps } from "@mui/material";

type TMenuContentProps = {
    onSettingsClick?: (e: React.MouseEvent) => void;
    onNewNoteClick?: (e: React.MouseEvent) => void;
    onSaveClick?: (e: React.MouseEvent) => void;
    onLoadClick?: (e: React.MouseEvent) => void;
    onInfoClick?: (e: React.MouseEvent) => void;
};

const listStyle: SxProps = {};

const ListSubheaderStyle: SxProps = {
    fontSize: "1.3rem",
};

/**
 * содержимое для бокового меню приложения
 * @prop onSettingsClick - вызывается при клике на "Настройки"
 * @prop onNewNoteClick - вызывается при клике на "новая заметка"
 * @prop onSaveClick - вызывается при клике на "Сохранить"
 * @prop onLoadClick - вызывается при клике на "Загрузить"
 * @prop onInfoClick - вызывается при клике на "О приложении"
 * @returns
 */
function MenuContent({ onSettingsClick, onNewNoteClick, onSaveClick, onLoadClick, onInfoClick }: TMenuContentProps) {
    return (
        <List sx={listStyle}>
            <ListSubheader component="div" id="nested-list-subheader" sx={ListSubheaderStyle}>
                Меню
            </ListSubheader>
            <Divider />
            <ListItemButton onClick={onNewNoteClick} aria-label="создать новую заметку">
                <ListItemIcon>
                    <EditNoteIcon />
                </ListItemIcon>
                <ListItemText>Новая заметка</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onSaveClick} aria-label="сохранить все на устройство">
                <ListItemIcon>
                    <SaveIcon />
                </ListItemIcon>
                <ListItemText>Сохранить</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onLoadClick} aria-label="загрузить коллекцию заметок с устроиства">
                <ListItemIcon>
                    <ImportContactsIcon />
                </ListItemIcon>
                <ListItemText>Загрузить</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onSettingsClick} aria-label="открыть меню настроек">
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Настройки</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onInfoClick} aria-label="открыть меню настроек">
                <ListItemIcon>
                    <InfoIcon />
                </ListItemIcon>
                <ListItemText>О приложении</ListItemText>
            </ListItemButton>
        </List>
    );
}

const MenuContentMemo = React.memo(MenuContent);

export { MenuContent, MenuContentMemo };
export type { TMenuContentProps };
