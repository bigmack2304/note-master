import React, { useState } from "react";
import { AppBar } from "0-shared/components/AppBar/AppBar";
import { ToggleMenuButton } from "2-features/components/ToggleMenuButton/ToggleMenuButton";
import { SettingsContent } from "1-entities/components/SettingsContent/SettingsContent";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";

type THeaderBarProps = {};

function HeaderBar({}: THeaderBarProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const onSettingsOpen = () => {
        setIsSettingsOpen(true);
    };

    const onSettingsClose = (e: Event, r: string) => {
        setIsSettingsOpen(false);
    };

    const onInfoOpen = () => {
        setIsInfoOpen(true);
    };

    const onInfoClose = (e: Event, r: string) => {
        setIsInfoOpen(false);
    };

    return (
        <AppBar>
            <ToggleMenuButton menuContentProps={{ onSettingsClick: onSettingsOpen, onInfoClick: onInfoOpen }} />
            <DialogWindow headerText="Меню настроек" isOpen={isSettingsOpen} onClose={onSettingsClose}>
                <SettingsContent />
            </DialogWindow>
            <DialogWindow headerText="О приложении" isOpen={isInfoOpen} onClose={onInfoClose}></DialogWindow>
        </AppBar>
    );
}

export { HeaderBar };
