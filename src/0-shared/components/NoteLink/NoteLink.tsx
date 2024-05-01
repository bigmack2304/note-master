import React, { useRef } from "react";
import { Link, Box, Collapse } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import * as styles from "./NoteLinkStyles";
import { NoteComponentMover } from "../NoteComponentMover/NoteComponentMover";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import "./NoteLink.scss";
import { DragDropWrapper } from "../DragDropWrapper/DragDropWrapper";

type TNoteLinkProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent, href: string, children: string) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    href: string;
    label: string;
    isLabel: boolean;
    dragId: string;
    isNoteEdit: boolean;
};

/**
 * Компонент описывает ссылку внутри заметки
 * @ ссылка может быть как на ресурс в интернете так и на другую заметку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 * @prop href - адрес ссылки
 * @prop label - текст ссылки
 * @prop isLabel - если true то текст ссылки = label, иначе href
 * @prop dragId - id компонента (в body заметки в indexed db) в котором лежит этот компонент
 * @prop isNoteEdit - редактируется ли в данный момент заметка
 */
function NoteLink({ addClassNames = [], onClick, href, onContextMenu, isLabel, label, dragId, isNoteEdit }: TNoteLinkProps) {
    const defaultClassName = "NoteLink";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const children = isLabel ? label : href;
    const isChildren = Boolean(children !== "" && children !== "#");
    const componentRef = useRef<HTMLDivElement>(null);
    const moverRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const innerWrapperClass = useNoteComponentDrag({ wrapperRef: componentRef, containerRef: contentRef, moverRef: moverRef, dragId, fullClassName: "NoteLink_wrapper" });

    // если children пуст, то добавляем в Typography класс text_empty
    if (!isChildren) {
        let tempClassName = genClassName.split(" ");
        tempClassName.push("text_empty");
        genClassName = tempClassName.join(" ");
    }

    const onLinkClick = (e: React.MouseEvent) => {
        if (children === "" || children === "#") {
            e.preventDefault();
        }
        onClick && onClick(e, href, children);
    };

    return (
        <DragDropWrapper ref={componentRef}>
            <Collapse in={isNoteEdit} orientation="vertical">
                <NoteComponentMover ref={moverRef} />
            </Collapse>
            <Box ref={contentRef} sx={styles.wrapperStyle(themeMode)} className={innerWrapperClass}>
                <Link href={href} className={genClassName} onContextMenu={onContextMenu} sx={styles.linkStyle(themeMode)} target="_blank" onClick={onLinkClick}>
                    {children === "#" ? "" : children}
                </Link>
            </Box>
        </DragDropWrapper>
    );
}

export { NoteLink };
