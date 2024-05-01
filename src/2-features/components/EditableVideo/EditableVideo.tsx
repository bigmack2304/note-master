import React, { useState, useEffect } from "react";
import { ClosableOneLineTextInput } from "2-features/components/ClosableOneLineTextInput/ClosableOneLineTextInput";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteComponentValue, deleteNoteComponent } from "5-app/GlobalState/saveDataInspectStore";
import { NoteVideo } from "1-entities/components/NoteVideo/NoteVideo";
import type { TBodyComponentVideo } from "0-shared/types/dataSave";

type TEditableVideoProps = {
    addClassNames?: string[];
    componentData: TBodyComponentVideo;
};

/**
 * компонент видео в заметку
 * @prop edit_id - id обьекта внутри body заметки, (из TempData в indexed db), с которым будет взаимодействовать этот компонент
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableVideo({ addClassNames = [], componentData }: TEditableVideoProps) {
    const defaultClassName = "EditableVideo";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [isEdit, setIsEdit] = useState(false); // true когда открываем форму для редактирования url компонента
    const [isPause, setIsPause] = useState(false); // на паузе-ли видео
    const [urlValue, setUrlValue] = useState(componentData.value); // урл адрес на видео
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null); // данные для кастомного контекстного меню
    const dispatch = useAppDispatch();
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote); // текущая активная заметка
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit); // находится-ли заметка в режиме редактирования

    const addClassess = () => {
        if (urlValue === "") {
            genClassName = genClassName.concat(" ", "video_empty");
        }

        if (isNoteEdit) {
            genClassName = genClassName.concat(" ", "EditableVideo--editable");
        }

        if (isPause) {
            genClassName = genClassName.concat(" ", "EditableVideo--pause");
        }
    };
    addClassess();

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
        setUrlValue("");
        setIsPause(false);

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: "" }));
    };

    const onMenuDelete = () => {
        if (!componentData || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: componentData.id }));
    };

    // клики в форме редактирования
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (inputValue: string) => {
        setIsEdit(false);
        setUrlValue(inputValue);
        setIsPause(true);

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentValue({ noteId: currentNoteData.id, componentId: componentData.id, newValue: inputValue }));
    };

    const onVideoPause = () => {
        setIsPause(true);
    };

    const onVideoPlay = () => {
        setIsPause(false);
    };

    const onWrapperClick = () => {
        if (isPause && !isNoteEdit) {
            setIsPause(false);
        }
    };

    return (
        <>
            {isEdit ? (
                <ClosableOneLineTextInput
                    addClassNames={[...addClassNames, "editable"]}
                    inputDefValue={urlValue}
                    placeholder="URL"
                    inputLabel="URL"
                    onClose={onInputExit}
                    onCloseSave={onInputSave}
                />
            ) : (
                <>
                    <NoteVideo
                        dragId={componentData.id}
                        isPause={isPause}
                        urlValue={urlValue}
                        onClick={onWrapperClick}
                        onContextMenu={onClickMoreActions}
                        onVideoPause={onVideoPause}
                        onVideoPlay={onVideoPlay}
                        addClassNames={[genClassName]}
                        isNoteEdit={isNoteEdit}
                    />

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            isClearDisabled={urlValue.length > 0 ? false : true}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                </>
            )}
        </>
    );
}

export { EditableVideo };
