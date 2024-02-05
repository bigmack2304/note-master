import React, { useState } from "react";
import { ClosableOneLineTextInput } from "2-features/components/ClosableOneLineTextInput/ClosableOneLineTextInput";
import { NoteHead } from "0-shared/components/NoteHead/NoteHead";
import { DopContextMenu } from "1-entities/components/DopContextMenu/DopContextMenu";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNote } from "5-app/GlobalState/saveDataInspectStore";
import { updateNodeValue } from "2-features/utils/saveDataEdit";

type TEditableHeaderProps = {
    defaultText?: string;
    editable?: boolean;
    edit_id?: string;
};

/**
 * Заголовок заметки с поддержкой редактирования
 * @prop defaultText - значение по умолчанию
 * @prop editable - true: показать форму редактирования по умолчанию, false: показать сам заголовок
 * @prop edit_id - id обьекта внутри body заметки, (из TempData в indexed db), с которым будет взаимодействовать этот компонент
 * @returns
 */
function EditableHeader({ defaultText = "", editable = false, edit_id }: TEditableHeaderProps) {
    const [isEdit, setIsEdit] = useState(editable);
    const [headerValue, setHeaderValue] = useState(defaultText);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchorEl);
    const dispatch = useAppDispatch();
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);

    const onClickMoreActions = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setMenuAnchorEl(e.currentTarget);
    };

    const onMenuClose = () => {
        setMenuAnchorEl(null);
    };

    // клики в меню опций
    const onMenuEdit = () => {
        setIsEdit(true);
        setMenuAnchorEl(null);
    };

    const onMenuClear = () => {
        setMenuAnchorEl(null);
        setHeaderValue("");

        if (!edit_id || !currentNoteData) return;
        dispatch(updateNote(updateNodeValue(currentNoteData, edit_id, "")));
    };

    // клики в форме редактирования
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (inputValue: string) => {
        setIsEdit(false);
        setHeaderValue(inputValue);

        if (!edit_id || !currentNoteData) return;
        dispatch(updateNote(updateNodeValue(currentNoteData, edit_id, inputValue)));
    };

    return (
        <>
            {isEdit ? (
                <ClosableOneLineTextInput addClassNames={["note__head"]} inputDefValue={headerValue} placeholder="заголовок" onClose={onInputExit} onCloseSave={onInputSave} />
            ) : (
                <>
                    <NoteHead addClassNames={["note__head"]} onContextMenu={onClickMoreActions}>
                        {headerValue}
                    </NoteHead>

                    <DopContextMenu isOpen={isMenuOpen} onClose={onMenuClose} anchorEl={menuAnchorEl}>
                        <ContextMenuEditContent onEditClick={onMenuEdit} onClearClick={onMenuClear} isClearDisabled={headerValue.length > 0 ? false : true} />
                    </DopContextMenu>
                </>
            )}
        </>
    );
}

export { EditableHeader };
