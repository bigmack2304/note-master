import React, { useState, useRef } from "react";
import { AppBar } from "0-shared/components/AppBar/AppBar";
import { ToggleMenuButton } from "2-features/components/ToggleMenuButton/ToggleMenuButton";
import { SettingsContent } from "2-features/components/SettingsContent/SettingsContent";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";
import { InputFile } from "2-features/components/InputFile/InputFile";
import { ToggleToolBarButton } from "2-features/components/ToggleToolBarButton/ToggleToolBarButton";
import { createNewProject, saveProjectInDb, loadProjectInDb } from "5-app/GlobalState/saveDataInspectStore";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { setIsOpen } from "5-app/GlobalState/leftMenuStore";
import { LoadDialog } from "2-features/components/LoadDialog/LoadDialog";
import { useAppSelector } from "0-shared/hooks/useAppSelector";

type THeaderBarProps = {};

/**
 * панель, на верху страницы
 * @returns
 */
function HeaderBar({}: THeaderBarProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isLoadDialog, setIsLoadDialog] = useState(false);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const isProject = useAppSelector((state) => state.saveDataInspect.isProjectOpen);
    const dispatch = useAppDispatch();

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
        setIsLoadDialog(true);
    };

    const onCreateNewProject = (e: React.MouseEvent<Element, MouseEvent>) => {
        dispatch(createNewProject());
        dispatch(setIsOpen({ isOpen: false }));
    };

    const onsaveClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        dispatch(saveProjectInDb());
    };

    const onloadDialogClose = () => {
        setIsLoadDialog(false);
    };

    const onloadDialogCloseSave = (val: "fs" | "db") => {
        setIsLoadDialog(false);

        if (val === "fs") {
            if (inputFileRef.current) inputFileRef.current.click();
            return;
        }

        if (val === "db") {
            dispatch(setIsOpen({ isOpen: false }));
            dispatch(loadProjectInDb());
        }
    };

    return (
        <AppBar>
            <ToggleMenuButton
                menuContentProps={{
                    onSettingsClick: onSettingsOpen,
                    onInfoClick: onInfoOpen,
                    onLoadClick: onLoadClick,
                    onNewProjectClick: onCreateNewProject,
                    onSaveClick: onsaveClick,
                    isSaveDisabled: !isProject,
                }}
            />
            <ToggleToolBarButton />
            <DialogWindow headerText="Меню настроек" isOpen={isSettingsOpen} onClose={onSettingsClose}>
                <SettingsContent />
            </DialogWindow>
            <DialogWindow headerText="О приложении" isOpen={isInfoOpen} onClose={onInfoClose}></DialogWindow>
            <LoadDialog isOpen={isLoadDialog} onClose={onloadDialogClose} onCloseSave={onloadDialogCloseSave} />
            <InputFile ref={inputFileRef}></InputFile>
        </AppBar>
    );
}

export { HeaderBar };
