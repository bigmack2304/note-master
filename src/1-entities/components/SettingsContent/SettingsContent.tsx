import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { ToggleThemeButton } from "2-features/components/ToggleThemeButton/ToggleThemeButton";
import type { SxProps } from "@mui/material";
import "./SettingsContent.scss";
import { OUTLINE_LIGHT_COLOR } from "5-app/settings";

type TSettingsContentProps = {};

const dialogListStyle: SxProps = {
    width: "clamp(0px, 1000px, 100%)",
    outline: `1px ${OUTLINE_LIGHT_COLOR} solid`,
    borderRadius: "10px",
};

/**
 * содержимое для DialogWindow, (страница с настройками)
 */
function SettingsContent({}: TSettingsContentProps) {
    return (
        <>
            <List sx={dialogListStyle}>
                <ListItem>
                    <ListItemIcon>
                        <ColorLensIcon />
                    </ListItemIcon>
                    <ListItemText>Цветовая тема</ListItemText>
                    <ToggleThemeButton />
                </ListItem>
            </List>
        </>
    );
}

export { SettingsContent };
export type { TSettingsContentProps };
