import React from "react";
import { LeftMenu } from "0-shared/components/LeftMenu/LeftMenu";
import { MenuButton } from "0-shared/components/MenuButton/MenuButton";
import { MenuContent } from "1-entities/components/MenuContent/MenuContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { toggleLeftMenu, setIsOpen } from "5-app/GlobalState/leftMenuStore";
import type { TMenuContentProps } from "1-entities/components/MenuContent/MenuContent";

type TToggleMenuButtonProps = {
    menuContentProps?: TMenuContentProps;
};
/**
 * кнопка открывает\закрывает боковое меню приложения
 * @prop menuContentProps : пропсы для MenuContent
 */
function ToggleMenuButton({ menuContentProps }: TToggleMenuButtonProps) {
    const isLeftMenuOpen = useAppSelector((state) => state.leftMenu.isOpen);
    const dispatch = useAppDispatch();

    const onOpenMenu = (e: React.MouseEvent) => {
        dispatch(toggleLeftMenu());
    };

    const onCloseMenu = (event: React.KeyboardEvent | React.MouseEvent) => {
        dispatch(setIsOpen({ isOpen: false }));
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
