import React, { useState, useEffect, useRef } from "react";
import { ClosableOneLineTextInput } from "2-features/components/ClosableOneLineTextInput/ClosableOneLineTextInput";
import ReactPlayer from "react-player";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { Box } from "@mui/material";
import { updateNoteComponentValue, deleteNoteComponent, updateNoteComponentHeaderSettings } from "5-app/GlobalState/saveDataInspectStore";
import type { TBodyComponentVideo } from "0-shared/types/dataSave";
import "./style.scss";
import * as styles from "./EditableVideoStyle";

type TEditableVideoProps = {
    editable?: boolean;
    addClassNames?: string[];
    componentData: TBodyComponentVideo;
};

/**
 * компонент видео в заметку
 * @prop editable - true: показать форму редактирования по умолчанию, false: показать сам заголовок
 * @prop edit_id - id обьекта внутри body заметки, (из TempData в indexed db), с которым будет взаимодействовать этот компонент
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableVideo({ editable = false, addClassNames = [], componentData }: TEditableVideoProps) {
    const defaultClassName = "EditableVideo";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [isEdit, setIsEdit] = useState(false);
    const [isPause, setIsPause] = useState(false);
    const [urlValue, setUrlValue] = useState(componentData.value);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);
    const themeValue = useTemeMode();

    const addClassess = () => {
        if (urlValue === "") {
            genClassName = genClassName.concat(" ", "video_empty");
        }

        if (editable) {
            genClassName = genClassName.concat(" ", "EditableVideo--editable");
        }

        if (isPause) {
            genClassName = genClassName.concat(" ", "EditableVideo--pause");
        }
    };
    addClassess();

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
        if (isPause) {
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
                    <Box onContextMenu={onClickMoreActions} onClick={onWrapperClick} className={genClassName} sx={styles.videoWrapperStyle(themeValue)}>
                        {urlValue !== "" && (
                            <ReactPlayer controls light url={urlValue} width={"100%"} height={"100%"} onPause={onVideoPause} onPlay={onVideoPlay} playing={!isPause} />
                        )}
                    </Box>

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
