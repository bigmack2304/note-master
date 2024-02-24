import React from "react";
import { Dialog } from "@mui/material";
import { CloseButton } from "0-shared/components/CloseButton/CloseButton";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import * as styles from "./FullScreenImagePrevStyles";

type TFullScreenImagePrevprops = {
    addClassNames?: string[];
    onClose?: () => void;
    imageSrc: string;
    imageAlt?: string;
};

/**
 * выводит картинку почти во весь экран
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClose - вызывается при закрытии
 * @prop imageSrc - src картинки
 * @prop imageAlt - alt описание картинки
 */
function FullScreenImagePrev({ addClassNames = [], onClose, imageSrc, imageAlt }: TFullScreenImagePrevprops) {
    const defaultClassName = "FullScreenImagePrev";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();

    const handleClose = () => {
        onClose && onClose();
    };

    const onImgClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const onContextMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Dialog open onClick={handleClose} className={genClassName} sx={styles.backdropStyle()} fullScreen onContextMenu={onContextMenu}>
            <div className={"FullScreenImagePrev__controls"} onClick={handleClose} style={styles.controlsStyle(themeValue)}>
                <CloseButton onClick={handleClose} />
            </div>
            <div className={"FullScreenImagePrev__content"} style={styles.contentStyle()}>
                <img src={imageSrc} alt={imageAlt} onClick={onImgClick} style={styles.imgStyle()} />
            </div>
        </Dialog>
    );
}

export { FullScreenImagePrev };
