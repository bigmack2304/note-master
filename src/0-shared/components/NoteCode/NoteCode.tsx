import React, { useRef } from "react";
import { Box, Accordion, Collapse, AccordionSummary, AccordionDetails } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { CodeBlock } from "react-code-blocks";
import { NoteComponentMover } from "../NoteComponentMover/NoteComponentMover";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as styles from "./NoteCodeStyles";
import { DragDropWrapper } from "../DragDropWrapper/DragDropWrapper";
import "./NoteCode.scss";
import type { TCodeLanguages, TCodeThemes } from "./NoteCodeTypes";

type TNoteCodeProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    children?: string;
    language?: TCodeLanguages;
    codeTheme?: TCodeThemes;
    isExpand?: boolean;
    expandDesc?: string;
    dragId: string;
    isNoteEdit: boolean;
};

/**
 * Компонент описывает код c подцветкой синтаксиса внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop children - компонент можно использовать как обертка для других компонентов.
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 * @prop language - название языка программирования
 * @prop codeTheme - выбор темы подцветки синтаксиса
 * @prop dragId - id компонента (в body заметки в indexed db) в котором лежит этот компонент
 * @prop isNoteEdit - редактируется ли в данный момент заметка
 */
function NoteCode({
    addClassNames = [],
    onClick,
    children = "",
    onContextMenu,
    language = "text",
    codeTheme = "auto",
    dragId,
    expandDesc,
    isExpand,
    isNoteEdit,
}: TNoteCodeProps) {
    const defaultClassName = "NoteCode";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(children);
    const componentRef = useRef<HTMLDivElement>(null);
    const moverRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    genClassName = useNoteComponentDrag({
        wrapperRef: componentRef,
        containerRef: contentRef,
        moverRef: moverRef,
        dragId,
        fullClassName: genClassName,
    });

    // если children пуст, то добавляем в Box класс text_empty
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
            <Box
                className={genClassName}
                sx={styles.codeWrapperStyle(themeMode)}
                onContextMenu={onContextMenu}
                onClick={onClick}
                ref={contentRef}
            >
                {isChildren &&
                    (function () {
                        const codeComponent = (
                            <CodeBlock
                                text={children}
                                language={language}
                                showLineNumbers={true}
                                theme={styles.calcCodeTheme(codeTheme, themeMode)}
                                customStyle={styles.codeStyle(isChildren) as Record<string, string>}
                            />
                        );

                        if (!isExpand) {
                            return codeComponent;
                        } else {
                            return (
                                <Accordion
                                    className="NoteCode__accordion"
                                    sx={styles.accordionStyle(themeMode)}
                                    slotProps={{ transition: { unmountOnExit: true } }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>{expandDesc}</AccordionSummary>
                                    <AccordionDetails>{codeComponent}</AccordionDetails>
                                </Accordion>
                            );
                        }
                    })()}
            </Box>
        </DragDropWrapper>
    );
}

export { NoteCode };
