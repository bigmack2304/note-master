import React from "react";
import Drawer from "@mui/material/Drawer";
import { TRANSITION_DURATION } from "5-app";
import type { GetProps } from "0-shared";

type TProps = {
    isOpen?: boolean;
    closeCallback?: (event: React.KeyboardEvent | React.MouseEvent) => void;
    drawerSettings?: GetProps<typeof Drawer>;
    children?: React.ReactNode;
};

function LeftMenu({ isOpen = false, closeCallback = () => {}, drawerSettings = {}, children }: TProps) {
    return (
        <Drawer anchor={"left"} open={isOpen} onClose={closeCallback} {...drawerSettings} transitionDuration={TRANSITION_DURATION}>
            {children}
        </Drawer>
    );
}

export { LeftMenu };
