import React, { useState, useEffect } from "react";
import { ClosableOneLineTextInput } from "2-features/components/ClosableOneLineTextInput/ClosableOneLineTextInput";
import { NoteHead } from "0-shared/components/NoteHead/NoteHead";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteComponentValue, deleteNoteComponent, updateNoteComponentHeaderSettings } from "5-app/GlobalState/saveDataInspectStore";
import { NoteHeaderEditDialog } from "../NoteHeaderEditDialog/NoteHeaderEditDialog";
import type { TBodyComponentHeader } from "0-shared/types/dataSave";

type TEditableHeaderProps = {
    defaultText?: string;
    editable?: boolean;
    addClassNames?: string[];
    componentData: TBodyComponentHeader;
};

const genTextDopClasses = (data: { isEdit: boolean; textAligin: TBodyComponentHeader["textAligin"]; headerSize: TBodyComponentHeader["headerSize"] }) => {
    const classes: string[] = [];

    if (data.isEdit) {
        classes.push("NoteHead--editable");
    }

    switch (data.textAligin) {
        case "left":
            classes.push("NoteHead--aliginLeft");
            break;
        case "center":
            classes.push("NoteHead--aliginCenter");
            break;
        case "right":
            classes.push("NoteHead--aliginRight");
            break;
        default:
            break;
    }

    switch (data.headerSize) {
        case "h2":
            classes.push("NoteHead--sizeH2");
            break;
        case "h3":
            classes.push("NoteHead--sizeH3");
            break;
        case "h4":
            classes.push("NoteHead--sizeH4");
            break;
        case "h5":
            classes.push("NoteHead--sizeH5");
            break;
        case "h6":
            classes.push("NoteHead--sizeH6");
            break;
        default:
            break;
    }

    return classes;
};

/**
 * Заголовок заметки с поддержкой редактирования
 * @prop defaultText - значение по умолчанию
 * @prop editable - true: показать форму редактирования по умолчанию, false: показать сам заголовок
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableHeader({ defaultText = "", editable = false, addClassNames = [], componentData }: TEditableHeaderProps) {
    const [isEdit, setIsEdit] = useState(false);
    const [headerValue, setHeaderValue] = useState(defaultText);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    const [isHeaderEditDialog, setIsHeaderEditDialog] = useState(false);
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);

    // вычесляем дополнительгые классы для заголовка
    let textDopClasses = genTextDopClasses({
        isEdit: isNoteEdit,
        textAligin: componentData.textAligin,
        headerSize: componentData.headerSize,
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
        setHeaderValue("");

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: "" }));
    };

    const onMenuDelete = () => {
        if (!componentData || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: componentData.id }));
    };

    const onMenuParams = () => {
        setClickData(null);
        setIsHeaderEditDialog(true);
    };

    // клики в форме редактирования
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (inputValue: string) => {
        setIsEdit(false);
        setHeaderValue(inputValue);

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: inputValue }));
    };

    // функции окна с вормой настроек заголовка

    const onEditHeaderDialogClose = () => {
        setIsHeaderEditDialog(false);
    };

    const onEditHeaderDialogCloseSave = (data: { textAligin: TBodyComponentHeader["textAligin"]; headerSize: TBodyComponentHeader["headerSize"] }) => {
        setIsHeaderEditDialog(false);
        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentHeaderSettings({ componentId: componentData.id, noteId: currentNoteData.id, headerSize: data.headerSize, textAligin: data.textAligin }));
    };

    return (
        <>
            {isEdit ? (
                <ClosableOneLineTextInput
                    addClassNames={[...addClassNames, "editable"]}
                    inputDefValue={headerValue}
                    placeholder="заголовок"
                    inputLabel="заголовок"
                    onClose={onInputExit}
                    onCloseSave={onInputSave}
                />
            ) : (
                <>
                    {/* <Draggable wrappedProps={{ addClassNames: [...addClassNames, ...textDopClasses], onContextMenu: onClickMoreActions }} WrappedComponent={NoteHead}>
                        {headerValue}
                    </Draggable> */}
                    <NoteHead addClassNames={[...addClassNames, ...textDopClasses]} onContextMenu={onClickMoreActions} dragId={componentData.id}>
                        {headerValue}
                    </NoteHead>

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
                    {isHeaderEditDialog && <NoteHeaderEditDialog onClose={onEditHeaderDialogClose} onCloseSave={onEditHeaderDialogCloseSave} componentData={componentData} />}
                </>
            )}
        </>
    );
}

export { EditableHeader };
