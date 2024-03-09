import React, { useState, useEffect } from "react";
import { ClosableMultiLineTextInput } from "2-features/components/ClosableMultiLineTextInput/ClosableMultiLineTextInput";
import { NoteText } from "0-shared/components/NoteText/NoteText";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteComponentValue, deleteNoteComponent, updateNoteComponentTextSettings } from "5-app/GlobalState/saveDataInspectStore";
import { NoteTextEditDialog } from "../NoteTextEditDialog/NoteTextEditDialog";
import type { TBodyComponentText } from "0-shared/types/dataSave";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import * as styles from "./EditableTextStyles";

type TEditableTextProps = {
    defaultText?: string;
    editable?: boolean;
    addClassNames?: string[];
    componentData: TBodyComponentText;
};

/**
 * Текст заметки с поддержкой редактирования
 * @prop defaultText - значение по умолчанию
 * @prop editable - указывает на то редактируется ли заметка
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableText({ defaultText = "", editable = false, addClassNames = [], componentData }: TEditableTextProps) {
    const [isEdit, setIsEdit] = useState(false);
    const [textValue, setTextValue] = useState(defaultText);
    const [isTextEditDialog, setIsTextEditDialog] = useState(false);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    const currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);
    const themeValue = useTemeMode();

    // текст может иметь дополнительные стили в зависимости от настроек поэтому сразу их вычисляем
    let textDopClasses = styles.genTextDopClasses({
        fontType: componentData.font,
        lineBreak: componentData.lineBreak,
        textBackground: componentData.background,
        textFormat: componentData.formatting,
        theme: themeValue,
        isEdit: isNoteEdit,
    });

    useEffect(() => {
        if (!editable) {
            setIsEdit(false);
        }
    }, [editable]);

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
        setTextValue("");

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: "" }));
    };

    const onMenuDelete = () => {
        setClickData(null);
        if (!componentData || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: componentData.id }));
    };

    const onMenuParams = () => {
        setClickData(null);
        setIsTextEditDialog(true);
    };

    // клики в форме редактирования текста
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (inputValue: string) => {
        setIsEdit(false);
        setTextValue(inputValue);

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: inputValue }));
    };

    // форма управления параметрами текста
    const onEditTextDialogClose = () => {
        setIsTextEditDialog(false);
    };

    const onEditTextDialogCloseSave = (data: { textBackground: boolean; textFormat: boolean; fontValue: TBodyComponentText["font"]; lineBreak: boolean }) => {
        setIsTextEditDialog(false);

        if (!componentData || !currentNoteData) return;
        dispatch(
            updateNoteComponentTextSettings({
                noteId: currentNoteData.id,
                componentId: componentData.id,
                fontValue: data.fontValue,
                textBackground: data.textBackground,
                textFormat: data.textFormat,
                lineBreak: data.lineBreak,
            })
        );
    };

    if (!currentNoteData) return <></>;
    return (
        <>
            {isEdit ? (
                <ClosableMultiLineTextInput
                    addClassNames={[...addClassNames, "editable"]}
                    inputDefValue={textValue}
                    placeholder="текст"
                    inputLabel="текст"
                    onClose={onInputExit}
                    onCloseSave={onInputSave}
                />
            ) : (
                <>
                    <NoteText addClassNames={[...addClassNames, ...textDopClasses]} onContextMenu={onClickMoreActions} dragId={componentData.id} isNoteEdit={editable}>
                        {textValue}
                    </NoteText>

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            onParamsClick={onMenuParams}
                            isClearDisabled={textValue.length > 0 ? false : true}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                    {isTextEditDialog && <NoteTextEditDialog onClose={onEditTextDialogClose} onCloseSave={onEditTextDialogCloseSave} componentData={componentData} />}
                </>
            )}
        </>
    );
}

export { EditableText };
