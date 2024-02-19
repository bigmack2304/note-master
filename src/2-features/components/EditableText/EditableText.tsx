import React, { useState } from "react";
import { ClosableMultiLineTextInput } from "2-features/components/ClosableMultiLineTextInput/ClosableMultiLineTextInput";
import { NoteText } from "0-shared/components/NoteText/NoteText";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteComponentValue, deleteNoteComponent, updateNoteComponentTextSettings } from "5-app/GlobalState/saveDataInspectStore";
import { NoteTextEditDialog } from "../NoteTextEditDialog/NoteTextEditDialog";
import type { TBodyComponentText, TNoteBody } from "0-shared/types/dataSave";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { PaletteMode } from "@mui/material";
import { SxProps } from "@mui/material";

type TEditableTextProps = {
    defaultText?: string;
    editable?: boolean;
    edit_id?: string;
    addClassNames?: string[];
    componentData: TBodyComponentText;
};

const genTextDopClasses = (data: {
    textBackground: boolean;
    textFormat: boolean;
    fontType: TBodyComponentText["font"];
    theme: PaletteMode;
    lineBreak: boolean;
    isEdit: boolean;
}) => {
    const classes: string[] = [];

    if (data.textBackground) {
        if (data.theme === "light") {
            classes.push("NoteText--bg-light");
        }
        if (data.theme === "dark") {
            classes.push("NoteText--bg-dark");
        }
    }

    if (data.isEdit) {
        classes.push("NoteText--editable");
    }

    if (!data.textFormat) {
        classes.push("NoteText--noFormat");
    }

    if (data.fontType === "code") {
        classes.push("NoteText--font-code");
    }

    if (!data.lineBreak) {
        classes.push("NoteText--overflowXScroll");
    }

    return classes;
};

/**
 * Текст заметки с поддержкой редактирования
 * @prop defaultText - значение по умолчанию
 * @prop editable - true: показать форму редактирования по умолчанию, false: показать сам заголовок
 * @prop edit_id - id обьекта внутри body заметки, (из TempData в indexed db), с которым будет взаимодействовать этот компонент
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableText({ defaultText = "", editable = false, edit_id, addClassNames = [], componentData }: TEditableTextProps) {
    const [isEdit, setIsEdit] = useState(editable);
    const [headerValue, setHeaderValue] = useState(defaultText);
    const [isTextEditDialog, setIsTextEditDialog] = useState(false);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    const currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);
    const themeValue = useTemeMode();

    // текст может иметь дополнительные стили в зависимости от настроек поэтому сразу их вычисляем
    let textDopClasses = genTextDopClasses({
        fontType: componentData.font,
        lineBreak: componentData.lineBreak,
        textBackground: componentData.background,
        textFormat: componentData.formatting,
        theme: themeValue,
        isEdit: isNoteEdit,
    });

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
        setClickData(null);
        if (!edit_id || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: edit_id }));
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
        setHeaderValue(inputValue);

        if (!edit_id || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: edit_id, newValue: inputValue }));
    };

    // форма управления параметрами текста
    const onEditTextDialogClose = () => {
        setIsTextEditDialog(false);
    };

    const onEditTextDialogCloseSave = (data: { textBackground: boolean; textFormat: boolean; fontValue: TBodyComponentText["font"]; lineBreak: boolean }) => {
        setIsTextEditDialog(false);

        if (!edit_id || !currentNoteData) return;
        dispatch(
            updateNoteComponentTextSettings({
                noteId: currentNoteData.id,
                componentId: edit_id,
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
                    inputDefValue={headerValue}
                    placeholder="текст"
                    inputLabel="текст"
                    onClose={onInputExit}
                    onCloseSave={onInputSave}
                />
            ) : (
                <>
                    <NoteText addClassNames={[...addClassNames, ...textDopClasses]} onContextMenu={onClickMoreActions}>
                        {headerValue}
                    </NoteText>

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            onParamsClick={onMenuParams}
                            isClearDisabled={headerValue.length > 0 ? false : true}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                    {isTextEditDialog && (
                        <NoteTextEditDialog onClose={onEditTextDialogClose} onCloseSave={onEditTextDialogCloseSave} editId={edit_id} componentData={componentData} />
                    )}
                </>
            )}
        </>
    );
}

export { EditableText };
