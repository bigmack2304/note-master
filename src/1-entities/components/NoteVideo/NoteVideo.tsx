import React, { useRef, useEffect } from "react";
import { Box, Collapse } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import ReactPlayer from "react-player";
import { NoteComponentMover } from "0-shared/components/NoteComponentMover/NoteComponentMover";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import * as styles from "./NoteVideoStyle";
import "./NoteVideo.scss";
import { DragDropWrapper } from "0-shared/components/DragDropWrapper/DragDropWrapper";

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
    const videoRef = useRef<ReactPlayer>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const moverRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const innerWrapperClass = useNoteComponentDrag({ wrapperRef: componentRef, containerRef: contentRef, moverRef: moverRef, dragId, fullClassName: "NoteVideo_inner_wrapper" });

    const onPause = () => {
        onVideoPause && onVideoPause();
    };

    useEffect(() => {
        if (isNoteEdit && videoRef.current) {
            videoRef.current.showPreview();
        }
    }, [isNoteEdit]);

    return (
        <DragDropWrapper ref={componentRef}>
            <Collapse in={isNoteEdit} orientation="vertical">
                <NoteComponentMover ref={moverRef} />
            </Collapse>
            <Box ref={contentRef} className={innerWrapperClass} sx={styles.innerWrapperStyle(themeMode)}>
                <Box onContextMenu={onContextMenu} onClick={onClick} className={genClassName} sx={styles.videoWrapperStyle(themeMode)}>
                    {urlValue !== "" && (
                        <ReactPlayer
                            controls
                            light
                            url={urlValue}
                            width={"100%"}
                            height={"100%"}
                            onPause={onPause}
                            onPlay={onVideoPlay}
                            playing={!isPause}
                            stopOnUnmount
                            ref={videoRef}
                        />
                    )}
                </Box>
            </Box>
        </DragDropWrapper>
    );
}

export { NoteVideo };
