import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { Input, Divider } from "@mui/material";
import type { SxProps } from "@mui/material";
import { FolderSelect } from "../FolderSelect/FolderSelect";
import { AddTagSelect } from "../AddTagSelect/AddTagSelect";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { nameValidator } from "0-shared/utils/validators";

type TTreeAddNoteDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (noteName: string, NoteTags: string[] | string, targetFolderID?: string) => void;
    dialogHeader?: string;
    isTargetDefined?: boolean;
};

const inputStyle: SxProps = {
    paddingLeft: "4px",
    fontSize: "1.4rem",
};

/**
 * Диалоговое окно с формой для добавления новой заметки
 * @ используется при добавлении новой заметки в фаиловую структуру
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при подтверждении формы
 * @prop dialogHeader - заголовок окна
 * @prop isTargetDefined - (default:true)- если true значит что папка в которой создается заметка определена, если false то будет предоставлена форма для выбора папки
 */
function TreeAddNoteDialog({ onClose, onCloseSave, dialogHeader = "Новая заметка", isTargetDefined = true }: TTreeAddNoteDialogProps) {
    const [inputValue, setInputValue] = useState("");
    const [selectValue, setSelectValue] = useState<string[] | string>([]);
    const [searchFolderValue, setSearchFolderValue] = useState("");
    const currentFolder = useAppSelector((state) => state.saveDataInspect.currentFolder); // текущая активная папка
    const selectCurrentNoteData = currentFolder ? { id: currentFolder.id, name: currentFolder.name } : undefined;
    const [targetFolderID, setTargetFolderID] = useState<string | undefined>(currentFolder ? currentFolder.id : undefined);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (nameValidator(e.target.value)) {
            setInputValue(e.target.value);
        }
    };

    const onSelectChange = (tagNames: string | string[]) => {
        setSelectValue(typeof tagNames === "string" ? tagNames.split(",") : tagNames);
    };

    const onSave = () => {
        onCloseSave && onCloseSave(inputValue, selectValue, targetFolderID);
    };

    const onsearchFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFolderValue(e.target.value);
    };

    const onSelectFolderChange = (value: string) => {
        if (value === "") return;

        const prepareValue = JSON.parse(value) as { id: string; name: string };
        setTargetFolderID(prepareValue.id);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <Input value={inputValue} placeholder="имя заметки" onChange={onInputChange} sx={inputStyle} required />
            <AddTagSelect onChange={onSelectChange} />

            {!isTargetDefined && (
                <>
                    <Divider />
                    <Input value={searchFolderValue} placeholder="поиск папки" onChange={onsearchFolderChange} sx={inputStyle} />
                    <FolderSelect sortName={searchFolderValue} onChange={onSelectFolderChange} defaultValue={selectCurrentNoteData} />
                </>
            )}
        </DialogWindowAlt>
    );
}

export { TreeAddNoteDialog };
