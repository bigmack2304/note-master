import React, { useState, useRef } from "react";
import { AppBar } from "0-shared/components/AppBar/AppBar";
import { ToggleMenuButton } from "2-features/components/ToggleMenuButton/ToggleMenuButton";
import { SettingsContent } from "2-features/components/SettingsContent/SettingsContent";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";
import { InputFile } from "2-features/components/InputFile/InputFile";
import { ToggleToolBarButton } from "2-features/components/ToggleToolBarButton/ToggleToolBarButton";
import { createNewProject, saveProjectInDb, loadProjectInDb, exportTempDataSave } from "5-app/GlobalState/saveDataInspectStore";
import { resetFindNodeTree } from "5-app/GlobalState/toolBarStore";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { setIsOpen } from "5-app/GlobalState/leftMenuStore";
import { LoadDialog } from "2-features/components/LoadDialog/LoadDialog";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { addNote } from "5-app/GlobalState/saveDataInspectStore";
import { ExportProjectDialog } from "2-features/components/ExportProjectDialog/ExportProjectDialog";
import { TreeAddNoteDialog } from "2-features/components/TreeAddNoteDialog/TreeAddNoteDialog";
import { AppInfo } from "1-entities/components/AppInfo/AppInfo";

type THeaderBarProps = {};

/**
 * панель, на верху страницы
 * @returns
 */
function HeaderBar({}: THeaderBarProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // меню настроек открыта
    const [isInfoOpen, setIsInfoOpen] = useState(false); // открыто окно о приложении
    const [isExportOpen, setIsExportOpen] = useState(false); // открыта форма экспорта
    const [isNewNoteOpen, setIsNewNoteOpen] = useState(false); // открыта форма для новой заметки
    const [isLoadDialog, setIsLoadDialog] = useState(false); // открыта форма загрузить
    const inputFileRef = useRef<HTMLInputElement>(null); // ссылка на dom елемент загрузчика фаила с системы
    const isProject = useAppSelector((state) => state.saveDataInspect.isProjectOpen); // открыт ли какой либо проект

    const dispatch = useAppDispatch();

    // функции кнопок меню
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

    const onMenuExport = () => {
        setIsExportOpen(true);
    };

    const onNewNote = () => {
        setIsNewNoteOpen(true);
    };

    // загрузка
    const onLoadClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        setIsLoadDialog(true);
    };

    // новый проект
    const onCreateNewProject = (e: React.MouseEvent<Element, MouseEvent>) => {
        dispatch(createNewProject());
        dispatch(setIsOpen({ isOpen: false }));
        dispatch(resetFindNodeTree());
    };

    // сохранение
    const onsaveClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        dispatch(saveProjectInDb());
    };

    // окно загрузки
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

    // окно экспорта
    const onExportDialogClose = () => {
        setIsExportOpen(false);
    };

    const onExportDialogCloseSave = (val: string) => {
        setIsExportOpen(false);
        dispatch(setIsOpen({ isOpen: false }));
        dispatch(exportTempDataSave({ saveAs: val }));
    };

    // форма для новой заметки

    const onNewNoteClose = () => {
        setIsNewNoteOpen(false);
    };

    const onNewNoteCloseSave = (noteName: string, NoteTags: string | string[], targetFolderID?: string | undefined) => {
        setIsNewNoteOpen(false);
        dispatch(setIsOpen({ isOpen: false }));

        if (targetFolderID) {
            dispatch(addNote({ insertToId: targetFolderID, nodeName: noteName, tags: NoteTags }));
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
                    onExportClick: onMenuExport,
                    onNewNoteClick: onNewNote,
                    isSaveDisabled: !isProject,
                    isExportDisabled: !isProject,
                    isNewNoteDisabled: !isProject,
                }}
            />
            <ToggleToolBarButton />
            <DialogWindow headerText="Меню настроек" isOpen={isSettingsOpen} onClose={onSettingsClose}>
                <SettingsContent />
            </DialogWindow>
            <DialogWindow headerText="О приложении" isOpen={isInfoOpen} onClose={onInfoClose}>
                <AppInfo />
            </DialogWindow>
            <LoadDialog isOpen={isLoadDialog} onClose={onloadDialogClose} onCloseSave={onloadDialogCloseSave} />
            <ExportProjectDialog isOpen={isExportOpen} onClose={onExportDialogClose} onCloseSave={onExportDialogCloseSave} />
            {isNewNoteOpen && <TreeAddNoteDialog isTargetDefined={false} onClose={onNewNoteClose} onCloseSave={onNewNoteCloseSave} />}
            <InputFile ref={inputFileRef}></InputFile>
        </AppBar>
    );
}

export { HeaderBar };
