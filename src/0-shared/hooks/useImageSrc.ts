import React, { useState, useEffect, useRef } from "react";
import type { IDataImages } from "0-shared/types/dataSave";
import { getDataTreeDB } from "2-features/utils/appIndexedDB";
import { useIndexedDBImagesUpdate } from "./useIndexedDBImageUpdate";
import { getImageDB } from "2-features/utils/appIndexedDB";
import { isNoDataUrl } from "0-shared/utils/validators";

type TUseDataTreeParams = {
    componentImageID: string;
    onStartLoading?: () => void;
    onEndLoading?: () => void;
};

/**
 * возвращает строку со ссылкой на изображение. Специально для компонента NoteImage
 * @prop componentImageID - это id компонента noteImage, для него будем искать картинку в indexedDB
 */
function useImageSrc({ componentImageID, onStartLoading, onEndLoading }: TUseDataTreeParams) {
    const [imageSrc, setImageSrc] = useState<string>(""); // ссылка на картинку в вебе или на srcBlobUrl.current
    const srcBlobUrl = useRef<string>("");

    const resetSrcBlobUrl = () => {
        if (srcBlobUrl.current !== "") {
            URL.revokeObjectURL(srcBlobUrl.current);
            srcBlobUrl.current = "";
        }
    };

    const handlerFunc = () => {
        onStartLoading && onStartLoading();
        // запрашиваем картинку из indexed db
        getImageDB({
            key: componentImageID,
            callback: (imageData) => {
                // если чтото вернулось
                if (imageData) {
                    // проверяем что это url на сайт
                    if (isNoDataUrl(imageData.src)) {
                        setImageSrc(imageData.src);
                        resetSrcBlobUrl();
                    } else {
                        // если это не url то значит это base64 кодировоное изображение
                        // преобразуем его в blob и сгенерируем ссылку на него
                        fetch(imageData.src)
                            .then((response) => {
                                return response.blob();
                            })
                            .then((blob) => {
                                srcBlobUrl.current = URL.createObjectURL(blob);
                                setImageSrc(srcBlobUrl.current);
                            });
                    }
                } else {
                    setImageSrc("");
                    resetSrcBlobUrl();
                }
                onEndLoading && onEndLoading();
            },
            onError: () => {
                onEndLoading && onEndLoading();
            },
        });
    };

    useIndexedDBImagesUpdate(handlerFunc);

    useEffect(handlerFunc, []);

    useEffect(() => {
        return () => {
            resetSrcBlobUrl();
        };
    }, []);

    return imageSrc;
}

export { useImageSrc };
