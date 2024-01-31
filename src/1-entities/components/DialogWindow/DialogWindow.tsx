import React from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button } from "@mui/material";
import type { SxProps, DialogProps } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";
import { TransitionSlideRightForvardRef } from "0-shared/components/TransitionSlideFR/TransitionSlideFR";
import { TRANSITION_DURATION } from "5-app/settings";
import type { PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import { useTemeMode } from "0-shared/hooks/useThemeMode";

// диалоговое окно на весь экран с возможностью закрытия

type TDialogOnClose = GetProps<typeof Dialog>["onClose"];

type TDialogWindowProps = {
    dialogSettings?: DialogProps;
    isOpen: boolean;
    onClose?: TDialogOnClose;
    children?: React.ReactNode;
    headerText?: string;
};

const dialogStyle: SxProps = {};

const dialogTitleStyle = (theme: PaletteMode) => {
    return {
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    } as SxProps;
};

const dialogContentStyle: SxProps = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    overflowY: "auto",
};

const dialogActionsStyle = (theme: PaletteMode) => {
    return {
        justifyContent: "center",
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    } as SxProps;
};

function DialogWindow({ dialogSettings, isOpen, onClose = () => {}, children, headerText }: TDialogWindowProps) {
    const handleCloseDialog = () => {
        const event = {};
        const reason = "escapeKeyDown";
        onClose(event, reason);
    };

    const themeValue = useTemeMode();

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
            <DialogTitle sx={dialogTitleStyle(themeValue)}>{headerText}</DialogTitle>
            <DialogContent dividers sx={dialogContentStyle}>
                {children}
            </DialogContent>
            <DialogActions sx={dialogActionsStyle(themeValue)}>
                <div className="SettingsContent__actionsInner">
                    <Button variant="contained" onClick={handleCloseDialog}>
                        выход
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}

export { DialogWindow };
