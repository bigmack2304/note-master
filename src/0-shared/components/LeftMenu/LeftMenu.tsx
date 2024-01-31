import React from "react";
import Drawer from "@mui/material/Drawer";
import { TRANSITION_DURATION } from "5-app/settings";
import type { GetProps } from "0-shared/utils/typeHelpers";

type TLeftMenuProps = {
    isOpen?: boolean;
    closeCallback?: (event: React.KeyboardEvent | React.MouseEvent) => void;
    drawerSettings?: GetProps<typeof Drawer>;
    children?: React.ReactNode;
};

function LeftMenu({ isOpen = false, closeCallback = () => {}, drawerSettings = {}, children }: TLeftMenuProps) {
    return (
        <Drawer anchor={"left"} open={isOpen} onClose={closeCallback} {...drawerSettings} transitionDuration={TRANSITION_DURATION}>
            {children}
        </Drawer>
    );
}

const LeftMenuMemo = React.memo(LeftMenu);

export { LeftMenu, LeftMenuMemo };
