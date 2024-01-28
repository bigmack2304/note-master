import React, { useState } from "react";
import { LeftMenu } from "0-shared";
import { MenuButton } from "1-entities";
import { MenuContent } from "1-entities";
import type { TMenuContentProps } from "1-entities";

type TProps = {
    menuContentProps?: TMenuContentProps;
};

function ToggleMenuButton({ menuContentProps }: TProps) {
    const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);

    const onOpenMenu = (e: React.MouseEvent) => {
        setIsLeftMenuOpen((isOpen) => !isOpen);
    };

    const onCloseMenu = (event: React.KeyboardEvent | React.MouseEvent) => {
        setIsLeftMenuOpen(false);
    };

    return (
        <>
            <MenuButton clickCallback={onOpenMenu}></MenuButton>
            <LeftMenu closeCallback={onCloseMenu} isOpen={isLeftMenuOpen}>
                <MenuContent {...menuContentProps} />
            </LeftMenu>
        </>
    );
}

export { ToggleMenuButton };
