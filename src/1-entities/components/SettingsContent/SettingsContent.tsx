import React from "react";
import { Dialog, DialogActions, DialogTitle, List, ListItem, ListItemIcon, DialogContent, ListItemText, Button } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { ToggleThemeButton } from "2-features";
import { TransitionSlideRightForvardRef } from "0-shared";
import { TRANSITION_DURATION } from "5-app";
import type { SxProps, DialogProps } from "@mui/material";
import type { GetProps } from "0-shared";

type TDialogOnClose = GetProps<typeof Dialog>["onClose"];

type TProps = {
    dialogSettings?: DialogProps;
    isOpen: boolean;
    onClose?: TDialogOnClose;
};

const dialogStyle: SxProps = {};

const dialogContentStyle: SxProps = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
};

const dialogListStyle: SxProps = {
    width: "clamp(0px, 1000px, 100%)",
};

function SettingsContent({ dialogSettings, isOpen, onClose = () => {} }: TProps) {
    const handleCloseDialog = () => {
        const event = {};
        const reason = "escapeKeyDown";
        onClose(event, reason);
    };

    return (
        <Dialog
            open={isOpen}
            sx={dialogStyle}
            {...dialogSettings}
            onClose={onClose}
            fullScreen={true}
            TransitionComponent={TransitionSlideRightForvardRef}
            transitionDuration={TRANSITION_DURATION}
        >
            <DialogTitle>Меню настроек</DialogTitle>
            <DialogContent dividers sx={dialogContentStyle}>
                <List sx={dialogListStyle}>
                    <ListItem>
                        <ListItemIcon>
                            <ColorLensIcon />
                        </ListItemIcon>
                        <ListItemText>Цветовая тема</ListItemText>
                        <ToggleThemeButton />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleCloseDialog}>
                    выход
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export { SettingsContent };
export type { TProps };
