import React from "react";
import { ListItemIcon, ListItemText, List, ListItemButton, ListSubheader, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InfoIcon from "@mui/icons-material/Info";
import WorkIcon from "@mui/icons-material/Work";

import type { SxProps } from "@mui/material";

type TMenuContentProps = {
    onSettingsClick?: (e: React.MouseEvent) => void;
    onNewProjectClick?: (e: React.MouseEvent) => void;
    onSaveClick?: (e: React.MouseEvent) => void;
    onLoadClick?: (e: React.MouseEvent) => void;
    onInfoClick?: (e: React.MouseEvent) => void;
    onNewNoteClick?: (e: React.MouseEvent) => void;
    onExportClick?: (e: React.MouseEvent) => void;
    isSaveDisabled?: boolean;
    isExportDisabled?: boolean;
    isNewNoteDisabled?: boolean;
};

const listStyle: SxProps = {
    maxHeight: "100dvh",
};

const ListSubheaderStyle: SxProps = {
    fontSize: "1.3rem",
};

/**
 * содержимое для бокового меню приложения
 * @prop onSettingsClick - вызывается при клике на "Настройки"
 * @prop onNewProjectClick - вызывается при клике на "новый проект"
 * @prop onNewNoteClick - вызывается при клике на "создать новую заметку"
 * @prop onSaveClick - вызывается при клике на "Сохранить"
 * @prop onLoadClick - вызывается при клике на "Загрузить"
 * @prop onInfoClick - вызывается при клике на "О приложении"
 * @prop onExportClick - вызывается при клике на "Экспорт"
 * @prop isSaveDisabled - отключение кнопки "Сохранить"
 * @prop isExportDisabled - отключение кнопки "Экспорт"
 * @prop isNewNoteDisabled - отключение кнопки "создать новую заметку"
 */
function MenuContent({
    onSettingsClick,
    onNewProjectClick,
    onSaveClick,
    onLoadClick,
    onInfoClick,
    onExportClick,
    onNewNoteClick,
    isSaveDisabled = false,
    isNewNoteDisabled = false,
    isExportDisabled = false,
}: TMenuContentProps) {
    return (
        <List sx={listStyle}>
            <ListSubheader component="div" sx={ListSubheaderStyle}>
                Меню
            </ListSubheader>
            <Divider />
            <ListItemButton onClick={onNewProjectClick} aria-label="создать новый проект">
                <ListItemIcon>
                    <WorkIcon />
                </ListItemIcon>
                <ListItemText>Новый проект</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onNewNoteClick} aria-label="создать новую заметку" disabled={isNewNoteDisabled}>
                <ListItemIcon>
                    <EditNoteIcon />
                </ListItemIcon>
                <ListItemText>Новая заметка</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onSaveClick} aria-label="сохранить проект" disabled={isSaveDisabled}>
                <ListItemIcon>
                    <SaveIcon />
                </ListItemIcon>
                <ListItemText>Сохранить</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={onExportClick} aria-label="экспортировать на устройство" disabled={isExportDisabled}>
                <ListItemIcon>
                    <FileDownloadIcon />
                </ListItemIcon>
                <ListItemText>Экспортировать</ListItemText>
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
