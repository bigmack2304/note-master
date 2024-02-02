import React, { useState, useRef } from "react";
import { AppBar } from "0-shared/components/AppBar/AppBar";
import { ToggleMenuButton, ToggleMenuButtonMemo } from "2-features/components/ToggleMenuButton/ToggleMenuButton";
import { SettingsContent } from "1-entities/components/SettingsContent/SettingsContent";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";
import { InputFile } from "0-shared/components/InputFile/InputFile";

type THeaderBarProps = {};

function HeaderBar({}: THeaderBarProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const inputFileRef = useRef<HTMLInputElement>(null);

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

    const onLoadClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (!inputFileRef.current) return;

        inputFileRef.current.click();
    };

    return (
        <AppBar>
            <ToggleMenuButtonMemo menuContentProps={{ onSettingsClick: onSettingsOpen, onInfoClick: onInfoOpen, onLoadClick: onLoadClick }} />
            <DialogWindow headerText="Меню настроек" isOpen={isSettingsOpen} onClose={onSettingsClose}>
                <SettingsContent />
            </DialogWindow>
            <DialogWindow headerText="О приложении" isOpen={isInfoOpen} onClose={onInfoClose}></DialogWindow>
            <InputFile ref={inputFileRef}></InputFile>
        </AppBar>
    );
}

export { HeaderBar };
