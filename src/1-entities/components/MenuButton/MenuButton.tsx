import React from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

type TMenuButtonprops = {
    clickCallback?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
};

function MenuButton({ clickCallback = () => {}, disabled = false }: TMenuButtonprops) {
    return (
        <IconButton aria-label="меню" size="large" onClick={clickCallback} disabled={disabled}>
            <MenuIcon fontSize="inherit" />
        </IconButton>
    );
}

export { MenuButton };
