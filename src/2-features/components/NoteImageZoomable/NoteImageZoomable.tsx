import React, { useState } from "react";
import { FullScreenImagePrev } from "../FullScreenImagePrev/FullScreenImagePrev";
import { NoteImage } from "1-entities/components/NoteImage/NoteImage";
import type { TNoteImageProps } from "1-entities/components/NoteImage/NoteImage";

/**
 * картинка внутри заметки, с возможностью развернуть картинку на весь экран
 * @props все пропсы NoteImage, кроме onImgClick
 */
function NoteImageZoomable(dataProps: Omit<TNoteImageProps, "onImgClick">) {
    const [isImgPrev, setIsImgPrev] = useState(false);

    const onImageClick = (e: React.MouseEvent) => {
        setIsImgPrev(true);
    };

    const onPrevClose = () => {
        setIsImgPrev(false);
    };

    return (
        <>
            <NoteImage {...dataProps} onImgClick={onImageClick} />
            {isImgPrev && dataProps.imageData && <FullScreenImagePrev imageSrc={dataProps.imageData} imageAlt={dataProps.imageDesc} onClose={onPrevClose} />}
        </>
    );
}

export { NoteImageZoomable };
