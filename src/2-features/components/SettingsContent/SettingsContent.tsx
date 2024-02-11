import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { ToggleThemeButton } from "2-features/components/ToggleThemeButton/ToggleThemeButton";
import type { SxProps } from "@mui/material";
import "./SettingsContent.scss";
import { OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR } from "5-app/settings";
import type { PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import { TagColoringInForms } from "2-features/components/TagColoringInForms/TagColoringInForms";

type TSettingsContentProps = {};

const dialogListStyle = (theme: PaletteMode) => {
    return {
        width: "clamp(0px, 1000px, 100%)",
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
        borderRadius: "10px",
    } as SxProps;
};

/**
 * содержимое для DialogWindow, (страница с настройками)
 */
function SettingsContent({}: TSettingsContentProps) {
    const themeValue = useTemeMode();

    return (
        <>
            <List sx={dialogListStyle(themeValue)}>
                <ListItem>
                    <ListItemIcon>
                        <ColorLensIcon />
                    </ListItemIcon>
                    <ListItemText>Цветовая тема</ListItemText>
                    <ToggleThemeButton />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ViewStreamIcon />
                    </ListItemIcon>
                    <ListItemText>Подцветка тегов в формах</ListItemText>
                    <TagColoringInForms />
                </ListItem>
            </List>
        </>
    );
}

export { SettingsContent };
export type { TSettingsContentProps };
