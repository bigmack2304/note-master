import React, { useState } from "react";
import { LeftMenu } from "0-shared";
import { MenuButton } from "1-entities";
import { MenuContent } from "1-entities";

type TProps = {};

function ToggleMenuButton({}: TProps) {
    const [isOpen, setIsOpen] = useState(false);

    const onOpenMenu = (e: React.MouseEvent) => {
        setIsOpen((isOpen) => !isOpen);
    };

    const onCloseMenu = (event: React.KeyboardEvent | React.MouseEvent) => {
        setIsOpen(false);
    };

    return (
        <>
            <MenuButton clickCallback={onOpenMenu}></MenuButton>
            <LeftMenu closeCallback={onCloseMenu} isOpen={isOpen}>
                <MenuContent />
            </LeftMenu>
        </>
    );
}

export { ToggleMenuButton };
