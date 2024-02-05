import React from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

type TMenuButtonprops = {
    clickCallback?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
};

/**
 * кнопка бургер
 * @prop clickCallback - вызывается при клике на нее
 * @prop disabled - boolean для значения disabled этой кнопки
 */
function MenuButton({ clickCallback = () => {}, disabled = false }: TMenuButtonprops) {
    return (
        <IconButton aria-label="меню" size="large" onClick={clickCallback} disabled={disabled} title="меню">
            <MenuIcon fontSize="inherit" />
        </IconButton>
    );
}

export { MenuButton };
