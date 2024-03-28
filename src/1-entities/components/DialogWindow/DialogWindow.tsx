import React from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button } from "@mui/material";
import type { SxProps, DialogProps } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";
import { TransitionSlideRightForvardRef } from "0-shared/components/TransitionSlideFR/TransitionSlideFR";
import { TRANSITION_DURATION } from "5-app/settings";
import type { PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { Box } from "@mui/material";
import * as styles from "./DialogWindowStyle";
import "./DialogWindow.scss";

// диалоговое окно на весь экран с возможностью закрытия

type TDialogOnClose = GetProps<typeof Dialog>["onClose"];

type TDialogWindowProps = {
    dialogSettings?: DialogProps;
    isOpen: boolean;
    onClose?: TDialogOnClose;
    children?: React.ReactNode;
    headerText?: string;
    addClassNames?: string[];
};

/**
 * full Screen Dialog окно с кнопеой закрыть, без контента
 * @prop dialogSettings - пропсы для material ui компонента Dialog
 * @prop isOpen - boolean, открыто или закрыто окно
 * @prop onClose - вызывается при закрытии окна
 * @prop children - компонент может быть оберткой для других компонентов
 * @prop headerText - заголовок окна
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function DialogWindow({ dialogSettings, isOpen, onClose = () => {}, children, headerText, addClassNames = [] }: TDialogWindowProps) {
    const defaultClassName = "DialogWindow";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    const handleCloseDialog = () => {
        const event = {};
        const reason = "escapeKeyDown";
        onClose(event, reason);
    };

    const themeValue = useTemeMode();

    return (
        <Dialog
            open={isOpen}
            {...dialogSettings}
            onClose={onClose}
            fullScreen={true}
            className={genClassName}
            TransitionComponent={TransitionSlideRightForvardRef}
            transitionDuration={TRANSITION_DURATION}
        >
            <DialogTitle sx={styles.dialogTitleStyle(themeValue)}>{headerText}</DialogTitle>
            <DialogContent dividers className="DialogWindow__content">
                {children}
            </DialogContent>
            <DialogActions sx={styles.dialogActionsStyle(themeValue)} className="DialogWindow__actions">
                <Box className="DialogWindow__actions_inner">
                    <Button variant="contained" onClick={handleCloseDialog}>
                        выход
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export { DialogWindow };
