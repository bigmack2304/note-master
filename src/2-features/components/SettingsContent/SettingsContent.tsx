import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { ToggleThemeButton } from "2-features/components/ToggleThemeButton/ToggleThemeButton";
import "./SettingsContent.scss";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import MarginIcon from "@mui/icons-material/Margin";
import { TagColoringInForms } from "2-features/components/TagColoringInForms/TagColoringInForms";
import { NotePaddingColapseButton } from "../NotePaddingColapseButton/NotePaddingColapseButton";
import * as styles from "./SettingsContentStyle";

type TSettingsContentProps = {};

/**
 * содержимое для DialogWindow, (страница с настройками)
 */
function SettingsContent({}: TSettingsContentProps) {
    const themeValue = useTemeMode();

    return (
        <>
            <List sx={styles.dialogListStyle(themeValue)} className="SettingsContent">
                <ListItem className="SettingsContent__listItem">
                    <ListItemIcon>
                        <ColorLensIcon />
                    </ListItemIcon>
                    <ListItemText className="SettingsContent__listItemText">Цветовая тема</ListItemText>
                    <ToggleThemeButton />
                </ListItem>
                <ListItem className="SettingsContent__listItem">
                    <ListItemIcon>
                        <ViewStreamIcon />
                    </ListItemIcon>
                    <ListItemText className="SettingsContent__listItemText">Подцветка тегов в формах</ListItemText>
                    <TagColoringInForms />
                </ListItem>
                {/* // DEPRECATED */}
                {/* <ListItem className="SettingsContent__listItem">
                    <ListItemIcon>
                        <MarginIcon />
                    </ListItemIcon>
                    <ListItemText className="SettingsContent__listItemText">Уменьшенные отступы в заметках</ListItemText>
                    <NotePaddingColapseButton />
                </ListItem> */}
            </List>
        </>
    );
}

export { SettingsContent };
export type { TSettingsContentProps };
