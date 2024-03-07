import React, { useRef } from "react";
import { Box, Accordion, AccordionActions, AccordionSummary, AccordionDetails } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { CodeBlock } from "react-code-blocks";
import type { TCodeLanguages, TCodeThemes } from "./NoteCodeTypes";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as styles from "./NoteCodeStyles";
import "./style.scss";

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
 */
function NoteCode({ addClassNames = [], onClick, children = "", onContextMenu, language = "text", codeTheme = "auto", dragId, expandDesc, isExpand }: TNoteCodeProps) {
    const defaultClassName = "NoteCode";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(children);
    const ref = useRef<HTMLHeadElement>(null);
    const { onDragStart, onDragDrop, onDragOver, onDragLeave, onDragEnd } = useNoteComponentDrag({ ref, dragId });

    // если children пуст, то добавляем в Box класс text_empty
    if (!isChildren) {
        let tempClassName = genClassName.split(" ");
        tempClassName.push("text_empty");
        genClassName = tempClassName.join(" ");
    }

    return (
        <Box
            className={genClassName}
            sx={styles.codeWrapperStyle(themeMode)}
            onContextMenu={onContextMenu}
            onClick={onClick}
            onDragStart={onDragStart}
            onDrop={onDragDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
            ref={ref}
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
                            <Accordion className="NoteCode__accordion" sx={styles.accordionStyle(themeMode)} slotProps={{ transition: { unmountOnExit: true } }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>{expandDesc}</AccordionSummary>
                                <AccordionDetails>{codeComponent}</AccordionDetails>
                            </Accordion>
                        );
                    }
                })()}
        </Box>
    );
}

export { NoteCode };
