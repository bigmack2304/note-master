import React from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

type Tprops = {
    clickCallback?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
};

function MenuButton({ clickCallback = () => {}, disabled = false }: Tprops) {
    return (
        <IconButton aria-label="меню" size="medium" onClick={clickCallback} disabled={disabled} color="inherit">
            <MenuIcon fontSize="inherit" />
        </IconButton>
    );
}

export { MenuButton };
