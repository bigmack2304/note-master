import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import ReactPlayer from "react-player";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import * as styles from "./NoteVideoStyle";
import "./style.scss";

type TNoteVideoProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    onVideoPause?: () => void;
    onVideoPlay?: () => void;
    urlValue: string;
    isPause: boolean;
    dragId: string;
    isNoteEdit?: boolean;
};

/**
 * Компонент описывает видео внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на видео
 * @prop onContextMenu - вызывается при попытке вызвать контекстное меню на видео. Работает только если видео на паузе.
 * @prop onVideoPause - вызывается при постановке видео на паузу
 * @prop onVideoPlay - вызывается при  начале воспроизведения видео
 * @prop urlValue - ссылка на видео
 * @prop isPause - если true то видео стоит на паузе
 * @prop dragId - id компонента (в body заметки в indexed db) в котором лежит этот компонент
 * @prop isEdit - находится ли заметка в режиме редактирования в данный момент (нужно для корректной преостановки видео)
 */
function NoteVideo({ addClassNames = [], onClick, onContextMenu, dragId, urlValue, isPause, onVideoPause, onVideoPlay, isNoteEdit }: TNoteVideoProps) {
    const defaultClassName = "NoteVideo";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const ref = useRef<HTMLHeadElement>(null);
    const videoRef = useRef<ReactPlayer>(null);
    const { onDragStart, onDragDrop, onDragOver, onDragLeave, onDragEnd } = useNoteComponentDrag({ ref, dragId });

    const onPause = () => {
        onVideoPause && onVideoPause();
    };

    useEffect(() => {
        if (isNoteEdit && videoRef.current) {
            videoRef.current.showPreview();
        }
    }, [isNoteEdit]);

    return (
        <Box
            onContextMenu={onContextMenu}
            onClick={onClick}
            className={genClassName}
            sx={styles.videoWrapperStyle(themeMode)}
            ref={ref}
            onDragStart={onDragStart}
            onDrop={onDragDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
        >
            {urlValue !== "" && (
                <ReactPlayer controls light url={urlValue} width={"100%"} height={"100%"} onPause={onPause} onPlay={onVideoPlay} playing={!isPause} stopOnUnmount ref={videoRef} />
            )}
        </Box>
    );
}

export { NoteVideo };
