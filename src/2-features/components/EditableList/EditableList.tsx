import React, { useState, useEffect } from "react";
import { ClosableMultiLineTextInput } from "2-features/components/ClosableMultiLineTextInput/ClosableMultiLineTextInput";
import { NoteList } from "0-shared/components/NoteList/NoteList";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteComponentValue, deleteNoteComponent, updateNoteComponentListSettings } from "5-app/GlobalState/saveDataInspectStore";
import { NoteListEditDialog } from "../NoteListEditDialog/NoteListEditDialog";
import type { TBodyComponentList } from "0-shared/types/dataSave";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import * as styles from "./EditableListStyles";
import { ListEditWindow } from "../ListEditWindow/ListEditWindow";

type TEditableListProps = {
    defaultValue?: string;
    addClassNames?: string[];
    componentData: TBodyComponentList;
};

/**
 * список заметки с поддержкой редактирования
 * @prop defaultValue - значение по умолчанию
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableList({ defaultValue = "", addClassNames = [], componentData }: TEditableListProps) {
    const [isEdit, setIsEdit] = useState(false); // true когда открыто базовое окно редактирования
    const [listValue, setListValue] = useState(defaultValue); // содержимое компонента
    const [isListEditDialog, setIsListEditDialog] = useState(false); // true когда открыто окно дополнительных настроек
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null); // нужно для кастомного контекстного меню
    const dispatch = useAppDispatch();
    const currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote); // текущая открытая заметка
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);
    const themeValue = useTemeMode();

    // текст может иметь дополнительные стили в зависимости от настроек поэтому сразу их вычисляем
    let listDopClasses = styles.genListDopClasses({
        listIsNumeric: componentData.isNumeric,
        listBg: componentData.background,
        theme: themeValue,
        isEdit: isNoteEdit,
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

    // клики в меню опций
    const onMenuEdit = () => {
        setIsEdit(true);
        setClickData(null);
    };

    const onMenuClear = () => {
        setClickData(null);
        setListValue("");

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
        setIsListEditDialog(true);
    };

    // клики в форме редактирования текста
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (inputValue: string) => {
        setIsEdit(false);
        setListValue(inputValue);

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: inputValue }));
    };

    // форма управления параметрами текста
    const onEditListDialogClose = () => {
        setIsListEditDialog(false);
    };

    const onEditListDialogCloseSave = (data: { listBg: TBodyComponentList["background"]; isNumeric: TBodyComponentList["isNumeric"] }) => {
        setIsListEditDialog(false);

        if (!componentData || !currentNoteData) return;
        dispatch(
            updateNoteComponentListSettings({
                noteId: currentNoteData.id,
                componentId: componentData.id,
                listBg: data.listBg,
                isNumeric: data.isNumeric,
            })
        );
    };

    if (!currentNoteData) return <></>;
    return (
        <>
            {isEdit ? (
                <ListEditWindow addClassNames={[...addClassNames, "editable"]} listValue={listValue} isOpen={true} onCloseSave={onInputSave} isNimeric={componentData.isNumeric} />
            ) : (
                <>
                    <NoteList addClassNames={[...addClassNames, ...listDopClasses]} onContextMenu={onClickMoreActions} dragId={componentData.id} isNoteEdit={isNoteEdit}>
                        {listValue}
                    </NoteList>

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            onParamsClick={onMenuParams}
                            isClearDisabled={listValue.length > 0 ? false : true}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                    {isListEditDialog && <NoteListEditDialog onClose={onEditListDialogClose} onCloseSave={onEditListDialogCloseSave} componentData={componentData} />}
                </>
            )}
        </>
    );
}

export { EditableList };
