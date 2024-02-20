import React, { useState } from "react";
import { ClosableMultiLineTextInput } from "../ClosableMultiLineTextInput/ClosableMultiLineTextInput";
import { NoteCode } from "0-shared/components/NoteCode/NoteCode";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteComponentValue, deleteNoteComponent, updateNoteComponentCodeSettings } from "5-app/GlobalState/saveDataInspectStore";
import { NoteCodeEditDialog } from "../NoteCodeEditDialog/NoteCodeEditDialog";
import type { TBodyComponentCode } from "0-shared/types/dataSave";

type TEditableCodeProps = {
    defaultText?: string;
    editable?: boolean;
    edit_id?: string;
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
 * @prop editable - true: показать форму редактирования по умолчанию, false: показать сам заголовок
 * @prop edit_id - id обьекта внутри body заметки, (из TempData в indexed db), с которым будет взаимодействовать этот компонент
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableCode({ defaultText = "", editable = false, edit_id, addClassNames = [], componentData }: TEditableCodeProps) {
    const [isEdit, setIsEdit] = useState(editable);
    const [codeValue, setCodeValue] = useState(defaultText);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    const [isCodeEditDialog, setIsCodeEditDialog] = useState(false);
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);

    // вычесляем дополнительгые классы для заголовка
    let codeDopClasses = genCodeDopClasses(isNoteEdit);

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

        if (!edit_id || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: edit_id, newValue: "" }));
    };

    const onMenuDelete = () => {
        if (!edit_id || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: edit_id }));
    };

    const onMenuParams = () => {
        setClickData(null);
        setIsCodeEditDialog(true);
    };

    // клики в форме редактирования
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (inputValue: string) => {
        setIsEdit(false);
        setCodeValue(inputValue);

        if (!edit_id || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: edit_id, newValue: inputValue }));
    };

    // функции окна с вормой настроек заголовка

    const onEditHeaderDialogClose = () => {
        setIsCodeEditDialog(false);
    };

    const onEditHeaderDialogCloseSave = (codeTheme: TBodyComponentCode["codeTheme"], codeLanguage: TBodyComponentCode["language"]) => {
        setIsCodeEditDialog(false);
        if (!edit_id || !currentNoteData) return;
        dispatch(updateNoteComponentCodeSettings({ noteId: currentNoteData.id, componentId: edit_id, codeLanguage, codeTheme }));
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
                    >
                        {codeValue}
                    </NoteCode>

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            onParamsClick={onMenuParams}
                            isClearDisabled={codeValue.length > 0 ? false : true}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                    {isCodeEditDialog && <NoteCodeEditDialog onClose={onEditHeaderDialogClose} onCloseSave={onEditHeaderDialogCloseSave} componentData={componentData} />}
                </>
            )}
        </>
    );
}

export { EditableCode };
