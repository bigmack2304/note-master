import React from "react";
import Menu from "@mui/material/Menu";
import type { GetProps } from "0-shared/utils/typeHelpers";

// контекстное меню, отерывающееся по левому клику мыши по обьекту

type TDopContextMenuProps = {
    isOpen: boolean;
    anchorEl: GetProps<typeof Menu>["anchorEl"];
    onClose?: () => void;
    children?: React.ReactNode;
    menuSettings?: GetProps<typeof Menu>;
    addClassNames?: string[];
};

/**
 * Кастомное контекстное меню, без содержимого
 * @prop isOpen - boolean, открыто или закрыто меню
 * @prop anchorEl - htmlElement к которому это меню привязано
 * @prop onClose - вызывается при закрытии этого меню
 * @prop children - компонент может быть оберткой для других компонентов
 * @prop menuSettings - пропсы для material ui компонента Menu
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @returns
 */
function DopContextMenu({ isOpen, anchorEl, onClose, children, menuSettings, addClassNames = [] }: TDopContextMenuProps) {
    const defaultClassName = "DopContextMenu";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <Menu className={genClassName} open={isOpen} anchorEl={anchorEl} onClose={onClose} autoFocus={false} {...menuSettings}>
            {children}
        </Menu>
    );
}

export { DopContextMenu };
