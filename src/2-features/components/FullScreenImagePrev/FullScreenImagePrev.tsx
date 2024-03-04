import React, { useState, useRef } from "react";
import { Dialog } from "@mui/material";
import { CloseButton } from "0-shared/components/CloseButton/CloseButton";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import * as styles from "./FullScreenImagePrevStyles";
import "./style.scss";

type TFullScreenImagePrevprops = {
    addClassNames?: string[];
    onClose?: () => void;
    imageSrc: string;
    imageAlt?: string;
};

/**
 * выводит картинку почти во весь экран с возможностью зума
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClose - вызывается при закрытии
 * @prop imageSrc - src картинки
 * @prop imageAlt - alt описание картинки
 */
function FullScreenImagePrev({ addClassNames = [], onClose, imageSrc, imageAlt }: TFullScreenImagePrevprops) {
    const [isZoom, setIsZoom] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const defaultClassName = "FullScreenImagePrev";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();

    const handleClose = () => {
        onClose && onClose();
    };

    const onPanelClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // чтобы весь блок не закрывался при  клике
    };

    const onImgClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsZoom((state) => !state);
    };

    const onContextMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Dialog open onClick={handleClose} className={genClassName} fullScreen onContextMenu={onContextMenu}>
            <div className={"FullScreenImagePrev__controls"} onClick={onPanelClick} style={styles.controlsStyle(themeValue)}>
                <CloseButton onClick={handleClose} />
            </div>
            <div className={"FullScreenImagePrev__content"} ref={imageWrapperRef}>
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className={"FullScreenImagePrev__img"}
                    onClick={onImgClick}
                    style={styles.imgStyle({ isZoom, wrapper: imageWrapperRef.current, img: imageRef.current })}
                    ref={imageRef}
                />
            </div>
        </Dialog>
    );
}

export { FullScreenImagePrev };
