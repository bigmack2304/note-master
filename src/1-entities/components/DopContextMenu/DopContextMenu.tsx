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
