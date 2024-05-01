import React from "react";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { PopoverOrigin } from "@mui/material";

// контекстное меню, отерывающееся по левому клику мыши по обьекту

type TDopContextMenuProps = {
    isOpen: boolean;
    anchorEl: GetProps<typeof Menu>["anchorEl"];
    onClose?: () => void;
    children?: React.ReactNode;
    menuSettings?: GetProps<typeof Menu>;
    addClassNames?: string[];
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
};

const popoverDefault: PopoverOrigin = {
    vertical: "top",
    horizontal: "left",
};

/**
 * Кастомное контекстное меню (позиционируется к левому верхнему углу компонента), без содержимого
 * @prop isOpen - boolean, открыто или закрыто меню
 * @prop anchorEl - htmlElement к которому это меню привязано
 * @prop onClose - вызывается при закрытии этого меню
 * @prop children - компонент может быть оберткой для других компонентов
 * @prop menuSettings - пропсы для material ui компонента Menu
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @anchorOrigin - позеционирование окна к компоненту
 * @transformOrigin - позеционирование окна от самого себя
 */
function DopContextMenu({
    isOpen,
    anchorEl,
    onClose,
    children,
    menuSettings,
    addClassNames = [],
    anchorOrigin = popoverDefault,
    transformOrigin = popoverDefault,
}: TDopContextMenuProps) {
    const defaultClassName = "DopContextMenu";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <Menu
            {...menuSettings}
            className={genClassName}
            open={isOpen}
            anchorEl={anchorEl}
            onClose={onClose}
            autoFocus={false}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
        >
            <MenuList>{children}</MenuList>
        </Menu>
    );
}

export { DopContextMenu };
