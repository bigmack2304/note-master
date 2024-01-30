import React from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button } from "@mui/material";
import type { SxProps, DialogProps } from "@mui/material";
import type { GetProps } from "0-shared";
import { TransitionSlideRightForvardRef } from "0-shared";
import { TRANSITION_DURATION } from "5-app";
import { useTemeMode } from "0-shared";

// диалоговое окно на весь экран с возможностью закрытия

type TDialogOnClose = GetProps<typeof Dialog>["onClose"];

type TProps = {
    dialogSettings?: DialogProps;
    isOpen: boolean;
    onClose?: TDialogOnClose;
    children?: React.ReactNode;
    headerText?: string;
};

const dialogStyle: SxProps = {};

const dialogTitleStyle: SxProps = {
    backgroundColor: "#0000000d",
};

const dialogContentStyle: SxProps = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    overflowY: "auto",
};

const dialogActionsStyle: SxProps = {
    justifyContent: "center",
    backgroundColor: "#0000000d",
};

function DialogWindow({ dialogSettings, isOpen, onClose = () => {}, children, headerText }: TProps) {
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
            <DialogTitle sx={dialogTitleStyle}>{headerText}</DialogTitle>
            <DialogContent dividers sx={dialogContentStyle}>
                {children}
            </DialogContent>
            <DialogActions sx={dialogActionsStyle}>
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
