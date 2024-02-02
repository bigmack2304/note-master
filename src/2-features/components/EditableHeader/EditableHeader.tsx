import React, { useState } from "react";
import { ClosableOneLineTextInput } from "2-features/components/ClosableOneLineTextInput/ClosableOneLineTextInput";
import { NoteHead } from "0-shared/components/NoteHead/NoteHead";
import { DopContextMenu } from "1-entities/components/DopContextMenu/DopContextMenu";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";

type TEditableHeaderProps = {
    defaultText?: string;
    editable?: boolean;
};

function EditableHeader({ defaultText = "", editable = false }: TEditableHeaderProps) {
    const [isEdit, setIsEdit] = useState(editable);
    const [headerValue, setHeaderValue] = useState(defaultText);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchorEl);

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
    };

    // клики в форме редактирования
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (inputValue: string) => {
        setIsEdit(false);
        setHeaderValue(inputValue);
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
