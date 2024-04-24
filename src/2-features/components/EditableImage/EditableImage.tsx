import React, { useState, useEffect } from "react";
import { NoteImageEditDialog } from "../NoteImageEditDialog/NoteImageEditDialog";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { deleteNoteComponent, updateNoteComponentImage, updateNoteComponentImageSettings } from "5-app/GlobalState/saveDataInspectStore";
import { isUrl } from "0-shared/utils/validators";
import { useImageSrc } from "0-shared/hooks/useImageSrc";
import { ClosableImageForm } from "../ClosableImageForm/ClosableImageForm";
import * as styles from "./EditableImageStyle";
import "react-photo-view/dist/react-photo-view.css";
import { NotePhotoView } from "0-shared/components/NotePhotoView/NotePhotoView";
import type { TBodyComponentImage } from "0-shared/types/dataSave";

type TEditableImageProps = {
    addClassNames?: string[];
    componentData: TBodyComponentImage;
};

/**
 * Заголовок заметки с поддержкой редактирования
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableImage({ addClassNames = [], componentData }: TEditableImageProps) {
    const [isEdit, setIsEdit] = useState(false);
    const [isImageLoadDb, setIsImageLoadDb] = useState(false);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    const [isImageEditDialog, setIsImageEditDialog] = useState(false);
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);

    const imageSrc = useImageSrc({
        componentImageID: componentData.id,
        onStartLoading: () => {
            setIsImageLoadDb(true);
        },
        onEndLoading: () => {
            setIsImageLoadDb(false);
        },
    });

    //вычесляем дополнительгые классы для заголовка
    let textDopClasses = styles.genTextDopClasses({
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

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentImage({ noteId: currentNoteData.id, componentId: componentData.id, newName: "", newSrc: "" }));
    };

    const onMenuDelete = () => {
        if (!componentData || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: componentData.id }));
    };

    const onMenuParams = () => {
        setClickData(null);
        setIsImageEditDialog(true);
    };

    // клики в форме редактирования
    const onInputExit = () => {
        setIsEdit(false);
    };

    const onInputSave = (imgSrc: string, imgName: string) => {
        setIsEdit(false);

        // если есть imgName то изображение грузится с устрорйиства
        // если его нет, то прогоняем imgSrc через валидатор
        if (!isUrl(imgSrc) && !imgName) {
            return;
        }
        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentImage({ noteId: currentNoteData.id, componentId: componentData.id, newSrc: imgSrc, newName: imgName }));
    };

    // функции окна с формой настроек картинки
    const onEditImageDialogClose = () => {
        setIsImageEditDialog(false);
    };

    const onEditImageDialogCloseSave = (data: { imageDesc: string; isDescHidden: boolean }) => {
        setIsImageEditDialog(false);
        if (!componentData || !currentNoteData) return;
        dispatch(
            updateNoteComponentImageSettings({
                componentId: componentData.id,
                noteId: currentNoteData.id,
                imageDesc: data.imageDesc,
                isDescHidden: data.isDescHidden,
            })
        );
    };

    return (
        <>
            {isEdit ? (
                <ClosableImageForm
                    addClassNames={[...addClassNames, "editable"]}
                    onClose={onInputExit}
                    onCloseSave={onInputSave}
                    imgName={componentData.fileName}
                    inputUrlDefValue={imageSrc}
                />
            ) : (
                <>
                    <NotePhotoView
                        addClassNames={[...addClassNames, ...textDopClasses]}
                        isLoading={isImageLoadDb}
                        onContextMenu={onClickMoreActions}
                        imageDesc={componentData.desc}
                        isDescHidden={componentData.isDescHidden}
                        imageData={imageSrc}
                        dragId={componentData.id}
                        isNoteEdit={isNoteEdit}
                    ></NotePhotoView>

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            onParamsClick={onMenuParams}
                            isClearDisabled={componentData.value === "" ? true : false}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                    {isImageEditDialog && (
                        <NoteImageEditDialog
                            onClose={onEditImageDialogClose}
                            onCloseSave={onEditImageDialogCloseSave}
                            componentData={componentData}
                        />
                    )}
                </>
            )}
        </>
    );
}

export { EditableImage };
