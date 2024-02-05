import React, { useState, useRef } from "react";
import { AppBar } from "0-shared/components/AppBar/AppBar";
import { ToggleMenuButton } from "2-features/components/ToggleMenuButton/ToggleMenuButton";
import { SettingsContent } from "1-entities/components/SettingsContent/SettingsContent";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";
import { InputFile } from "0-shared/components/InputFile/InputFile";
import { ToggleToolBarButton } from "2-features/components/ToggleToolBarButton/ToggleToolBarButton";

type THeaderBarProps = {};

/**
 * панель, на верху страницы
 * @returns
 */
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
            <ToggleMenuButton menuContentProps={{ onSettingsClick: onSettingsOpen, onInfoClick: onInfoOpen, onLoadClick: onLoadClick }} />
            <ToggleToolBarButton />
            <DialogWindow headerText="Меню настроек" isOpen={isSettingsOpen} onClose={onSettingsClose}>
                <SettingsContent />
            </DialogWindow>
            <DialogWindow headerText="О приложении" isOpen={isInfoOpen} onClose={onInfoClose}></DialogWindow>
            <InputFile ref={inputFileRef}></InputFile>
        </AppBar>
    );
}

export { HeaderBar };
