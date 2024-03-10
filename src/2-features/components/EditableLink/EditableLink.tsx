import React, { useState, useEffect } from "react";
import { ClosableLinkForm } from "../ClosableLinkForm/ClosableLinkForm";
import { NoteLink } from "0-shared/components/NoteLink/NoteLink";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import {
    updateNoteComponentLink,
    deleteNoteComponent,
    updateNoteComponentValue,
    updateNoteComponentLinkSettings,
    redirectNoteComponentLink,
} from "5-app/GlobalState/saveDataInspectStore";
import { NoteLinkEditDialog } from "../NoteLinkEditDialog/NoteLinkEditDialog";
import type { TBodyComponentLink } from "0-shared/types/dataSave";
import type { TRadioData } from "../NoteSelector/NoteSelector";

type TEditableLinkProps = {
    addClassNames?: string[];
    componentData: TBodyComponentLink;
};

const genTextDopClasses = (data: { isEdit: boolean; isBg: boolean }) => {
    const classes: string[] = [];

    if (data.isEdit) {
        classes.push("NoteLink--editable");
    }

    if (data.isBg) {
        classes.push("NoteLink--bg");
    }

    return classes;
};

/**
 * Заголовок заметки с поддержкой редактирования
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableLink({ addClassNames = [], componentData }: TEditableLinkProps) {
    const [isEdit, setIsEdit] = useState(false);
    const [linkValue, setLinkValue] = useState(componentData.value);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    const [isLinkEditDialog, setIsLinkEditDialog] = useState(false);
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);

    // вычесляем дополнительгые классы для заголовка
    let textDopClasses = genTextDopClasses({
        isEdit: isNoteEdit,
        isBg: componentData.background,
    });

    useEffect(() => {
        if (!isNoteEdit) {
            setIsEdit(false);
        }
    }, [isNoteEdit]);

    const onClickMoreActions = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        setClickData(
            clickData === null
                ? {
                      x: e.clientX + 2,
                      y: e.clientY - 6,
                  }
                : null
        );
    };

    const onMenuClose = () => {
        setClickData(null);
    };

    // клик по ссылке
    const onLinkClick = (e: React.MouseEvent, href: string, children: string) => {
        // если ссылка ведет на заметку
        if (componentData.target === "note") {
            e.preventDefault();
            try {
                let linkData = JSON.parse(href) as TRadioData;
                if (currentNoteData && linkData.id === currentNoteData.id) {
                    // нельзя переходит на заметку, если id текущей заметки такоеже как и у заметки по ссылке
                    return;
                }
                dispatch(redirectNoteComponentLink({ url: linkData }));
            } catch {}
            return;
        }

        // если ссылка пустая
        if (linkValue === "" || linkValue === "#") {
            e.preventDefault();
        }
    };

    // клики в меню опций
    const onMenuEdit = () => {
        setIsEdit(true);
        setClickData(null);
    };

    const onMenuClear = () => {
        setClickData(null);
        setLinkValue("#");

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: "#" }));
    };

    const onMenuDelete = () => {
        if (!componentData || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: componentData.id }));
    };

    const onMenuParams = () => {
        setClickData(null);
        setIsLinkEditDialog(true);
    };

    // клики в форме редактирования
    const onFormExit = () => {
        setIsEdit(false);
    };

    const onFormSave = (data: { target: TBodyComponentLink["target"]; value: TBodyComponentLink["value"] }) => {
        setIsEdit(false);
        setLinkValue(data.value);

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentLink({ noteId: currentNoteData.id, componentId: componentData.id, target: data.target, value: data.value }));
    };

    // функции окна с вормой настроек заголовка

    const onEditHeaderDialogClose = () => {
        setIsLinkEditDialog(false);
    };

    const onEditHeaderDialogCloseSave = (data: { isLabel: TBodyComponentLink["isLabel"]; isBg: TBodyComponentLink["background"]; labelVal: TBodyComponentLink["labelValue"] }) => {
        setIsLinkEditDialog(false);
        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentLinkSettings({ componentId: componentData.id, noteId: currentNoteData.id, isBg: data.isBg, isLabel: data.isLabel, labelVal: data.labelVal }));
    };

    return (
        <>
            {isEdit ? (
                <ClosableLinkForm
                    addClassNames={[...addClassNames, "editable"]}
                    urlValue={linkValue}
                    placeholder="URL"
                    inputLabel="URL"
                    onClose={onFormExit}
                    onCloseSave={onFormSave}
                    target={componentData.target}
                />
            ) : (
                <>
                    <NoteLink
                        addClassNames={[...addClassNames, ...textDopClasses]}
                        onContextMenu={onClickMoreActions}
                        onClick={onLinkClick}
                        href={componentData.value}
                        label={componentData.labelValue}
                        isLabel={componentData.isLabel}
                        dragId={componentData.id}
                        isNoteEdit={isNoteEdit}
                    />

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            onParamsClick={onMenuParams}
                            isClearDisabled={linkValue === "" || linkValue === "#" ? true : false}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                    {isLinkEditDialog && <NoteLinkEditDialog onClose={onEditHeaderDialogClose} onCloseSave={onEditHeaderDialogCloseSave} componentData={componentData} />}
                </>
            )}
        </>
    );
}

export { EditableLink };
