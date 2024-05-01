import React, { useState, useEffect } from "react";
import { ClosableMultiLineTextInput } from "../ClosableMultiLineTextInput/ClosableMultiLineTextInput";
import { NoteCode } from "0-shared/components/NoteCode/NoteCode";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteComponentValue, deleteNoteComponent, updateNoteComponentCodeSettings } from "5-app/GlobalState/saveDataInspectStore";
import { NoteCodeEditDialog } from "../NoteCodeEditDialog/NoteCodeEditDialog";
import { useClipboardText } from "0-shared/hooks/useClipboardText";
import type { TBodyComponentCode } from "0-shared/types/dataSave";
import type { TOnSaveType } from "../NoteCodeEditDialog/NoteCodeEditDialog";

type TEditableCodeProps = {
    defaultText?: string;
    addClassNames?: string[];
    componentData: TBodyComponentCode;
};

const genCodeDopClasses = (isEdit: boolean) => {
    const classes: string[] = [];

    if (isEdit) {
        classes.push("NoteCode--editable");
    }

    return classes;
};

/**
 * Код заметки с поддержкой редактирования
 * @prop defaultText - значение по умолчанию
 * @prop editable - указывает на то редактируется ли заметка
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableCode({ defaultText = "", addClassNames = [], componentData }: TEditableCodeProps) {
    const [isEdit, setIsEdit] = useState(false);
    const [codeValue, setCodeValue] = useState(defaultText);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    const [isCodeEditDialog, setIsCodeEditDialog] = useState(false);
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);
    const [clipboardReadText, clipboardWriteText] = useClipboardText();

    // вычесляем дополнительгые классы для заголовка
    let codeDopClasses = genCodeDopClasses(isNoteEdit);

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

    // клики в меню опций
    const onMenuEdit = () => {
        setIsEdit(true);
        setClickData(null);
    };

    const onMenuClear = () => {
        setClickData(null);
        setCodeValue("");

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: "" }));
    };

    const onMenuDelete = () => {
        if (!componentData || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: componentData.id }));
    };

    const onMenuParams = () => {
        setClickData(null);
        setIsCodeEditDialog(true);
    };

    const onMenuCopy = () => {
        setClickData(null);
        clipboardWriteText(componentData.value);
    };

    // клики в форме редактирования
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (inputValue: string) => {
        setIsEdit(false);
        setCodeValue(inputValue);

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: inputValue }));
    };

    // функции окна с вормой настроек заголовка

    const onEditHeaderDialogClose = () => {
        setIsCodeEditDialog(false);
    };

    const onEditHeaderDialogCloseSave = (data: TOnSaveType) => {
        setIsCodeEditDialog(false);
        if (!componentData || !currentNoteData) return;
        dispatch(
            updateNoteComponentCodeSettings({
                noteId: currentNoteData.id,
                componentId: componentData.id,
                codeLanguage: data.selectCodeLanguage,
                codeTheme: data.selectCodeTheme,
                isExpand: data.isExpand,
                expandDesc: data.expandDesc,
            })
        );
    };

    return (
        <>
            {isEdit ? (
                <ClosableMultiLineTextInput
                    addClassNames={[...addClassNames, "editable"]}
                    inputDefValue={codeValue}
                    placeholder="код"
                    inputLabel="код"
                    onClose={onInputExit}
                    onCloseSave={onInputSave}
                />
            ) : (
                <>
                    <NoteCode
                        addClassNames={[...addClassNames, ...codeDopClasses]}
                        onContextMenu={onClickMoreActions}
                        codeTheme={componentData.codeTheme}
                        language={componentData.language}
                        expandDesc={componentData.expandDesc}
                        isExpand={componentData.isExpand}
                        dragId={componentData.id}
                        isNoteEdit={isNoteEdit}
                    >
                        {codeValue}
                    </NoteCode>

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            onParamsClick={onMenuParams}
                            onCopyClick={onMenuCopy}
                            isClearDisabled={codeValue.length > 0 ? false : true}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                    {isCodeEditDialog && (
                        <NoteCodeEditDialog
                            onClose={onEditHeaderDialogClose}
                            onCloseSave={onEditHeaderDialogCloseSave}
                            componentData={componentData}
                        />
                    )}
                </>
            )}
        </>
    );
}

export { EditableCode };
