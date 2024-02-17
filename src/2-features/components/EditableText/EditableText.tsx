import React, { useState } from "react";
import { ClosableMultiLineTextInput } from "2-features/components/ClosableMultiLineTextInput/ClosableMultiLineTextInput";
import { NoteText } from "0-shared/components/NoteText/NoteText";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteComponentValue, deleteNoteComponent } from "5-app/GlobalState/saveDataInspectStore";

type TEditableTextProps = {
    defaultText?: string;
    editable?: boolean;
    edit_id?: string;
    addClassNames?: string[];
};

/**
 * Текст заметки с поддержкой редактирования
 * @prop defaultText - значение по умолчанию
 * @prop editable - true: показать форму редактирования по умолчанию, false: показать сам заголовок
 * @prop edit_id - id обьекта внутри body заметки, (из TempData в indexed db), с которым будет взаимодействовать этот компонент
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function EditableText({ defaultText = "", editable = false, edit_id, addClassNames = [] }: TEditableTextProps) {
    const [isEdit, setIsEdit] = useState(editable);
    const [headerValue, setHeaderValue] = useState(defaultText);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);

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
        setHeaderValue("");

        if (!edit_id || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: edit_id, newValue: "" }));
    };

    const onMenuDelete = () => {
        if (!edit_id || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: edit_id }));
    };

    // клики в форме редактирования
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (inputValue: string) => {
        setIsEdit(false);
        setHeaderValue(inputValue);

        if (!edit_id || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: edit_id, newValue: inputValue }));
    };

    return (
        <>
            {isEdit ? (
                <ClosableMultiLineTextInput
                    addClassNames={[...addClassNames, "editable"]}
                    inputDefValue={headerValue}
                    placeholder="Форматируемый текст"
                    inputLabel="Форматируемый текст"
                    onClose={onInputExit}
                    onCloseSave={onInputSave}
                />
            ) : (
                <>
                    <NoteText addClassNames={addClassNames} onContextMenu={onClickMoreActions}>
                        {headerValue}
                    </NoteText>

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            isClearDisabled={headerValue.length > 0 ? false : true}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                </>
            )}
        </>
    );
}

export { EditableText };
