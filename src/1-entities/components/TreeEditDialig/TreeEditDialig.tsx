import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { CloseButton } from "0-shared/components/CloseButton/CloseButton";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { SxProps, DialogProps, PaletteMode } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";

type TDialogOnClose = GetProps<typeof Dialog>["onClose"];

type TreeEditDialigPropos = {
    dialogSettings?: DialogProps;
    children?: React.ReactNode;
    isOpen: boolean;
    onClose?: TDialogOnClose;
    onCloseSave?: TDialogOnClose;
    headerText?: string;
};

const dialogStyle: SxProps = {};

const dialogTitleStyle = (theme: PaletteMode) => {
    return {
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        padding: "5px",
        columnGap: "5px",
        justifyContent: "space-between",
    } as SxProps;
};

const dialogContentStyle: SxProps = {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    overflowY: "auto",
    alignItems: "stretch",
    rowGap: "25px",
};

const dialogActionsStyle = (theme: PaletteMode) => {
    return {
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
    } as SxProps;
};

/**
 * Dialog окно с кнопкой закрыть и сохранить, без контента
 * @prop dialogSettings - пропсы для material ui компонента Dialog
 * @prop isOpen - boolean, открыто или закрыто окно
 * @prop onClose - вызывается при закрытии окна
 * @prop children - компонент может быть оберткой для других компонентов
 * @prop headerText - заголовок окна
 * @prop onCloseSave - закрытие окна с подтверждением диалога
 */
function TreeEditDialig({ children, isOpen, dialogSettings, onClose, onCloseSave, headerText = "" }: TreeEditDialigPropos) {
    const handleCloseDialog = () => {
        const event = {};
        const reason = "escapeKeyDown";
        onClose && onClose(event, reason);
    };

    const handleCloseSaveDialog = (e: React.FormEvent) => {
        e.preventDefault();
        const event = {};
        const reason = "escapeKeyDown";
        onCloseSave && onCloseSave(event, reason);
    };

    const themeValue = useTemeMode();

    return (
        <Dialog open={isOpen} sx={dialogStyle} {...dialogSettings} onClose={onClose}>
            <form onSubmit={handleCloseSaveDialog} autoComplete="off">
                <div style={dialogTitleStyle(themeValue) as React.CSSProperties}>
                    <DialogTitle>{headerText}</DialogTitle>
                    <CloseButton onClick={handleCloseDialog}></CloseButton>
                </div>
                <DialogContent dividers sx={dialogContentStyle}>
                    {children}
                </DialogContent>
                <DialogActions sx={dialogActionsStyle(themeValue)}>
                    <Button variant="contained" type="submit">
                        Сохранить
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export { TreeEditDialig };
