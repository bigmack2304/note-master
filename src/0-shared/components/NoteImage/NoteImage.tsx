import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { FullScreenImagePrev } from "0-shared/components/FullScreenImagePrev/FullScreenImagePrev";
import * as styles from "./NoteImageStyle";

type TNoteImageProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    imageData?: string;
    imageDesc?: string;
    isDescHidden?: boolean;
    isLoading?: boolean;
};

/**
 * картинка внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick вызывается при клике по всему окну
 * @prop onContextMenu вызывается при клике левой кнопкой мыши по всему окну
 * @prop imageData ссылка на картинку (src)
 * @prop imageDesc описание (alt) картинки
 * @prop isDescHidden если true то описание не отображается
 * @prop isLoading если true то отображает значок загрузки
 */
function NoteImage({ addClassNames = [], onClick, onContextMenu, imageData, imageDesc, isLoading = false, isDescHidden }: TNoteImageProps) {
    const defaultClassName = "NoteImage";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [isImgPrev, setIsImgPrev] = useState(false);
    const themeMode = useTemeMode();
    const isChildren = Boolean(!imageData || imageData === "" ? false : true);

    // если children пуст, то добавляем в Box класс img_empty
    if (!isChildren) {
        let tempClassName = genClassName.split(" ");
        tempClassName.push("img_empty");
        genClassName = tempClassName.join(" ");
    }

    const onImageClick = () => {
        setIsImgPrev(true);
    };

    const onPrevClose = () => {
        setIsImgPrev(false);
    };

    return (
        <Box className={genClassName} sx={styles.noteImageStyle(isChildren, themeMode)} onContextMenu={onContextMenu} onClick={onClick}>
            <figure className="NoteImage__imgWrapper" style={styles.imageWrapperStyle()}>
                {isLoading ? (
                    <CircularProgress sx={styles.imageLoaderStyle()} />
                ) : (
                    <>
                        <img className="NoteImage__img" style={styles.imageStyle()} src={imageData} alt={imageDesc} loading="lazy" decoding="auto" onClick={onImageClick} />
                        {isDescHidden === true && (
                            <Typography className="NoteImage__img_name" component={"figcaption"} sx={styles.imageDescStyle()}>
                                {imageDesc}
                            </Typography>
                        )}
                        {isImgPrev && imageData && <FullScreenImagePrev imageSrc={imageData} imageAlt={imageDesc} onClose={onPrevClose} />}
                    </>
                )}
            </figure>
        </Box>
    );
}

export { NoteImage };
