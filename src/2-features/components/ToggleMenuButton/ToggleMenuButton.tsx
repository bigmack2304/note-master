import React, { useState } from "react";
import { LeftMenu, LeftMenuMemo } from "0-shared/components/LeftMenu/LeftMenu";
import { MenuButton } from "1-entities/components/MenuButton/MenuButton";
import { MenuContent, MenuContentMemo } from "1-entities/components/MenuContent/MenuContent";
import type { TMenuContentProps } from "1-entities/components/MenuContent/MenuContent";

type TToggleMenuButtonProps = {
    menuContentProps?: TMenuContentProps;
};

function ToggleMenuButton({ menuContentProps }: TToggleMenuButtonProps) {
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

const ToggleMenuButtonMemo = React.memo(ToggleMenuButton);

export { ToggleMenuButton, ToggleMenuButtonMemo };
