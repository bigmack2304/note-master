import React, { useRef } from "react";
import { Typography, Box, Collapse } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { GetProps } from "0-shared/utils/typeHelpers";
import * as styles from "./NoteTextStyles";
import "./NoteText.scss";
import { NoteComponentMover } from "../NoteComponentMover/NoteComponentMover";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import { DragDropWrapper } from "../DragDropWrapper/DragDropWrapper";

type TNoteTextProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    children?: React.ReactNode;
    typographySettings?: GetProps<typeof Typography>;
    dragId: string;
    isNoteEdit: boolean;
};

/**
 * Компонент описывает текст внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop children - компонент можно использовать как обертка для других компонентов.
 * @prop typographySettings - пропсы для настройки внутреннего компонента m.ui - Typography
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 * @prop dragId - id компонента (в body заметки в indexed db) в котором лежит этот компонент
 * @prop isNoteEdit - редактируется ли в данный момент заметка
 */
function NoteText({ addClassNames = [], onClick, children, typographySettings, onContextMenu, dragId, isNoteEdit }: TNoteTextProps) {
    const defaultClassName = "NoteText";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(children);
    const componentRef = useRef<HTMLDivElement>(null);
    const moverRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const innerWrapperClass = useNoteComponentDrag({ wrapperRef: componentRef, containerRef: contentRef, moverRef: moverRef, dragId, fullClassName: "NoteText_outWrapper" });

    // если children пуст, то добавляем в Typography класс text_empty
    if (!isChildren) {
        let tempClassName = genClassName.split(" ");
        tempClassName.push("text_empty");
        genClassName = tempClassName.join(" ");
    }

    return (
        <DragDropWrapper ref={componentRef}>
            <Collapse in={isNoteEdit} orientation="vertical">
                <NoteComponentMover ref={moverRef} />
            </Collapse>
            <Box className={innerWrapperClass} ref={contentRef} sx={styles.wrapperStyle(themeMode)}>
                <Box className={"NoteText_wrapper"}>
                    <Typography
                        {...typographySettings}
                        className={genClassName}
                        variant="body1"
                        onContextMenu={onContextMenu}
                        onClick={onClick}
                        sx={styles.typographyStyle(themeMode)}
                    >
                        {children}
                    </Typography>
                </Box>
            </Box>
        </DragDropWrapper>
    );
}

export { NoteText };
