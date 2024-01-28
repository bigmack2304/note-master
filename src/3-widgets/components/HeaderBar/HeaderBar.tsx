import React, { useState } from "react";
import { AppBar } from "0-shared";
import { ToggleMenuButton } from "2-features";
import { SettingsContent } from "1-entities";

type TProps = {};

function HeaderBar({}: TProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const onSettingsOpen = () => {
        setIsSettingsOpen(true);
    };

    const onSettingsClose = (e: Event, r: string) => {
        setIsSettingsOpen(false);
    };

    return (
        <AppBar>
            <ToggleMenuButton menuContentProps={{ onSettingsClick: onSettingsOpen }} />
            <SettingsContent isOpen={isSettingsOpen} onClose={onSettingsClose}></SettingsContent>
        </AppBar>
    );
}

export { HeaderBar };
