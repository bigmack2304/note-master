import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import * as styles from "./NoteImageStyle";
import "./style.scss";

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
 */
function NoteImage({ addClassNames = [], onClick, onContextMenu, onImgClick, imageData, imageDesc, isLoading = false, isDescHidden, dragId }: TNoteImageProps) {
    const defaultClassName = "NoteImage";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(!imageData || imageData === "" ? false : true);
    const ref = useRef<HTMLHeadElement>(null);
    const { onDragStart, onDragDrop, onDragOver, onDragLeave, onDragEnd } = useNoteComponentDrag({ ref, dragId });

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
        <Box
            component={"div"}
            className={genClassName}
            sx={styles.noteImageStyle(themeMode)}
            onContextMenu={onContextMenu}
            onClick={onClick}
            ref={ref}
            onDragStart={onDragStart}
            onDrop={onDragDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
        >
            <figure className="NoteImage__imgWrapper">
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <img className="NoteImage__img" src={imageData} alt={imageDesc} loading="lazy" decoding="auto" onClick={onImageClick} />
                        {isDescHidden === true && (
                            <Typography className="NoteImage__img_name" component={"figcaption"}>
                                {imageDesc}
                            </Typography>
                        )}
                    </>
                )}
            </figure>
        </Box>
    );
}

export { NoteImage };
export type { TNoteImageProps };
