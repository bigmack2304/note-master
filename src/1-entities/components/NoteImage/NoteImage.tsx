import React, { useRef } from "react";
import { Box, Typography, Collapse } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { NoteComponentMover } from "0-shared/components/NoteComponentMover/NoteComponentMover";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import * as styles from "./NoteImageStyle";
import "./NoteImage.scss";
import { DragDropWrapper } from "0-shared/components/DragDropWrapper/DragDropWrapper";

type TNoteImageProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onImgClick?: (e: React.MouseEvent) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    imageData?: string;
    imageDesc?: string;
    isDescHidden?: boolean;
    isLoading?: boolean;
    dragId: string;
    isNoteEdit: boolean;
};

/**
 * картинка внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick вызывается при клике по всему окну
 * @prop onImgClick вызывается при клике по картинке
 * @prop onContextMenu вызывается при клике левой кнопкой мыши по всему окну
 * @prop imageData ссылка на картинку (src)
 * @prop imageDesc описание (alt) картинки
 * @prop isDescHidden если true то описание не отображается
 * @prop isLoading если true то отображает значок загрузки
 * @prop isNoteEdit - редактируется ли в данный момент заметка
 */
function NoteImage({ addClassNames = [], onClick, onContextMenu, onImgClick, imageData, imageDesc, isLoading = false, isDescHidden, dragId, isNoteEdit }: TNoteImageProps) {
    const defaultClassName = "NoteImage";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(!imageData || imageData === "" ? false : true);
    const componentRef = useRef<HTMLDivElement>(null);
    const moverRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapClassName = useNoteComponentDrag({ wrapperRef: componentRef, containerRef: contentRef, moverRef: moverRef, dragId, fullClassName: "NoteImage__out_wrapper" });

    // если children пуст, то добавляем в Box класс img_empty
    if (!isChildren) {
        let tempClassName = genClassName.split(" ");
        tempClassName.push("img_empty");
        genClassName = tempClassName.join(" ");
    }

    const onImageClick = (e: React.MouseEvent) => {
        onImgClick && onImgClick(e);
    };

    return (
        <DragDropWrapper ref={componentRef}>
            <Collapse in={isNoteEdit} orientation="vertical">
                <NoteComponentMover ref={moverRef} />
            </Collapse>
            <Box ref={contentRef} className={wrapClassName} sx={styles.innerWrapperStyle(themeMode)}>
                <Box component={"div"} className={genClassName} sx={styles.noteImageStyle(themeMode)} onContextMenu={onContextMenu} onClick={onClick}>
                    <figure className="NoteImage__imgWrapper">
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <img className="NoteImage__img" src={imageData} alt={imageDesc} loading="eager" decoding="auto" onClick={onImageClick} />
                                {isDescHidden === true && (
                                    <Typography className="NoteImage__img_name" component={"figcaption"}>
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

export { NoteImage };
export type { TNoteImageProps };
