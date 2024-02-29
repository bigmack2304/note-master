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

type DialogWindowAltPropos = {
    dialogSettings?: DialogProps;
    children?: React.ReactNode;
    isOpen: boolean;
    onClose?: TDialogOnClose;
    onCloseSave?: TDialogOnClose;
    headerText?: string;
    actionButtonName?: string;
    actionButton?: boolean;
    addClassNames?: string[];
};

const dialogStyle: SxProps = {
    "&.DialogWindowAlt .MuiPaper-root": {
        width: "clamp(306px, 50%, 600px)",
    },
};

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
 * Dialog окно, без контента
 * @prop dialogSettings - пропсы для material ui компонента Dialog
 * @prop isOpen - boolean, открыто или закрыто окно
 * @prop onClose - вызывается при закрытии окна без подтверждения
 * @prop onCloseSave - закрытие окна с подтверждением (нажатие на actionButton)
 * @prop children - компонент может быть оберткой для других компонентов
 * @prop headerText - заголовок окна
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop actionButton - нужнали кнопка подтверждения
 * @prop actionButtonName - имя кнопки подтверждения
 */
function DialogWindowAlt({
    children,
    isOpen,
    dialogSettings,
    onClose,
    onCloseSave,
    headerText = "",
    actionButtonName = "",
    actionButton,
    addClassNames = [],
}: DialogWindowAltPropos) {
    const defaultClassName = "DialogWindowAlt";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

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
        <Dialog {...dialogSettings} open={isOpen} sx={dialogStyle} onClose={onClose} className={genClassName}>
            <form onSubmit={handleCloseSaveDialog} autoComplete="off">
                <div style={dialogTitleStyle(themeValue) as React.CSSProperties}>
                    <DialogTitle>{headerText}</DialogTitle>
                    <CloseButton onClick={handleCloseDialog}></CloseButton>
                </div>
                <DialogContent dividers sx={dialogContentStyle}>
                    {children}
                </DialogContent>
                <DialogActions sx={dialogActionsStyle(themeValue)}>
                    {actionButton ? (
                        <Button variant="contained" type="submit">
                            {actionButtonName}
                        </Button>
                    ) : null}
                </DialogActions>
            </form>
        </Dialog>
    );
}

export { DialogWindowAlt };
