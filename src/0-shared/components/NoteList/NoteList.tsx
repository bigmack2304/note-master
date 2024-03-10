import React, { useRef } from "react";
import { Box, Collapse } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import * as styles from "./NoteListStyles";
import "./NoteList.scss";
import { NoteComponentMover } from "../NoteComponentMover/NoteComponentMover";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import { DragDropWrapper } from "../DragDropWrapper/DragDropWrapper";
import { prepareChildren } from "./NoteListFuncs";

type TNoteListProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    children?: string; // предпологается что это будет json преобразуемый в TContentType
    dragId: string;
    isNoteEdit: boolean;
};

/**
 * Компонент описывает список внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop children - строка с закодированным содержимым, должна преобразоввыватся через JSON в TContentType
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 * @prop dragId - id компонента (в body заметки в indexed db) в котором лежит этот компонент
 * @prop isNoteEdit - редактируется ли в данный момент заметка
 */
function NoteList({ addClassNames = [], onClick, children, onContextMenu, dragId, isNoteEdit }: TNoteListProps) {
    const defaultClassName = "NoteList";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const componentRef = useRef<HTMLDivElement>(null);
    const moverRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const innerWrapperClass = useNoteComponentDrag({ wrapperRef: componentRef, containerRef: contentRef, moverRef: moverRef, dragId, fullClassName: "NoteList_outWrapper" });

    let processedСontent = prepareChildren(children);

    const isChildren = Boolean(processedСontent.length !== 0);

    // если children пуст, то добавляем класс text_empty
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
            <Box className={innerWrapperClass} ref={contentRef} sx={styles.outWrapperStyle(themeMode)}>
                <Box className={"NoteList_wrapper"}>
                    <Box component={"ul"} className={genClassName} onContextMenu={onContextMenu} onClick={onClick} sx={styles.ListStyle(themeMode)}>
                        {processedСontent.map((value, index) => {
                            return (
                                <li key={generateHashCode(value) + index} className="NoteList__li">
                                    {value}
                                </li>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </DragDropWrapper>
    );
}

export { NoteList };
