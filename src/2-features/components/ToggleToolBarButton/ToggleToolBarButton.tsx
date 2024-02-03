import React, { useState } from "react";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import { IconButton } from "@mui/material";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { toggleIsActive } from "5-app/GlobalState/toolBarStore";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import type { TMenuContentProps } from "1-entities/components/MenuContent/MenuContent";

type TToggleToolBarButtonProps = {
    menuContentProps?: TMenuContentProps;
};

function ToggleToolBarButton({ menuContentProps }: TToggleToolBarButtonProps) {
    const dispatch = useAppDispatch();

    const onClick = (e: React.MouseEvent) => {
        dispatch(toggleIsActive());
    };

    return (
        <IconButton aria-label="показать панель инструментов" size="large" onClick={onClick} title="показать панель инструментов">
            <ViewComfyIcon fontSize="inherit" />
        </IconButton>
    );
}

const ToggleToolBarButtonMemo = React.memo(ToggleToolBarButton);

export { ToggleToolBarButton, ToggleToolBarButtonMemo };
