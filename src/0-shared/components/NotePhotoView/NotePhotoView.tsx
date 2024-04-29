import React, { useRef } from "react";
import { Box, Typography, Collapse } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { NoteComponentMover } from "0-shared/components/NoteComponentMover/NoteComponentMover";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import * as styles from "./NotePhotoViewStyle";
import "./NotePhotoView.scss";
import { DragDropWrapper } from "0-shared/components/DragDropWrapper/DragDropWrapper";
import { PhotoProvider, PhotoView } from "react-photo-view";

type TNotePhotoViewProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    imageData?: string;
    imageDesc?: string;
    isDesc?: boolean;
    isLoading?: boolean;
    dragId: string;
    isNoteEdit: boolean;
};

/**
 * картинка внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick вызывается при клике по всему окну
 * @prop onContextMenu вызывается при клике левой кнопкой мыши по всему окну
 * @prop imageData ссылка на картинку (src)
 * @prop imageDesc описание (alt) картинки
 * @prop isDesc если true то описание отображается
 * @prop isLoading если true то отображает значок загрузки
 * @prop isNoteEdit - редактируется ли в данный момент заметка
 */
function NotePhotoView({
    addClassNames = [],
    onClick,
    onContextMenu,
    imageData,
    imageDesc,
    isLoading = false,
    isDesc,
    dragId,
    isNoteEdit,
}: TNotePhotoViewProps) {
    const defaultClassName = "NotePhotoView";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(!imageData || imageData === "" ? false : true);
    const componentRef = useRef<HTMLDivElement>(null);
    const moverRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapClassName = useNoteComponentDrag({
        wrapperRef: componentRef,
        containerRef: contentRef,
        moverRef: moverRef,
        dragId,
        fullClassName: "NotePhotoView__out_wrapper",
    });

    // если children пуст, то добавляем в Box класс img_empty
    if (!isChildren) {
        let tempClassName = genClassName.split(" ");
        tempClassName.push("img_empty");
        genClassName = tempClassName.join(" ");
    }

    return (
        <DragDropWrapper ref={componentRef}>
            <Collapse in={isNoteEdit} orientation="vertical">
                <NoteComponentMover ref={moverRef} />
            </Collapse>
            <Box ref={contentRef} className={wrapClassName} sx={styles.innerWrapperStyle(themeMode)}>
                <Box
                    component={"div"}
                    className={genClassName}
                    sx={styles.NotePhotoViewStyle(themeMode)}
                    onContextMenu={onContextMenu}
                    onClick={onClick}
                >
                    <figure className="NotePhotoView__imgWrapper">
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <PhotoProvider bannerVisible={false}>
                                    <PhotoView src={imageData}>
                                        <img
                                            src={imageData}
                                            alt={imageDesc}
                                            className="NotePhotoView__img"
                                            decoding="auto"
                                            loading="eager"
                                        />
                                    </PhotoView>
                                </PhotoProvider>
                                {isDesc === true && (
                                    <Typography className="NotePhotoView__img_name" component={"figcaption"}>
                                        {imageDesc}
                                    </Typography>
                                )}
                            </>
                        )}
                    </figure>
                </Box>
            </Box>
        </DragDropWrapper>
    );
}

export { NotePhotoView };
