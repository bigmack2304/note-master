import React from "react";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import type { GetProps } from "0-shared/utils/typeHelpers";

// контекстное меню, отерывающееся по левому клику мыши по обьекту

type TDopContextMenuFreeProps = {
    mousePos: { x: number; y: number } | null;
    onClose?: () => void;
    children?: React.ReactNode;
    menuSettings?: GetProps<typeof Menu>;
    addClassNames?: string[];
};

/**
 * Кастомное контекстное меню, открывается на позиции клика мишью, без содержимого
 * @prop isOpen - boolean, открыто или закрыто меню
 * @prop anchorEl - htmlElement к которому это меню привязано
 * @prop onClose - вызывается при закрытии этого меню
 * @prop children - компонент может быть оберткой для других компонентов
 * @prop menuSettings - пропсы для material ui компонента Menu
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function DopContextMenuFree({ mousePos, onClose, children, menuSettings, addClassNames = [] }: TDopContextMenuFreeProps) {
    const defaultClassName = "DopContextMenuFree";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    const isOpen = mousePos !== null;
    const anchPos = isOpen ? { top: mousePos.y, left: mousePos.x } : undefined;

    return (
        <Menu {...menuSettings} className={genClassName} onClose={onClose} autoFocus={false} open={isOpen} anchorReference="anchorPosition" anchorPosition={anchPos}>
            <MenuList>{children}</MenuList>
        </Menu>
    );
}

export { DopContextMenuFree };
