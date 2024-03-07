import React, { useRef } from "react";
import { Link, Box } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import * as styles from "./NoteLinkStyles";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import "./style.scss";

type TNoteLinkProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent, href: string, children: string) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    href: string;
    label: string;
    isLabel: boolean;
    dragId: string;
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
 */
function NoteLink({ addClassNames = [], onClick, href, onContextMenu, isLabel, label, dragId }: TNoteLinkProps) {
    const defaultClassName = "NoteLink";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const children = isLabel ? label : href;
    const isChildren = Boolean(children !== "" && children !== "#");
    const wrapperRef = useRef<HTMLHeadElement>(null);
    const { onDragStart, onDragDrop, onDragOver, onDragLeave, onDragEnd } = useNoteComponentDrag({ ref: wrapperRef, dragId });

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
        <Box
            className={"NoteLink_wrapper"}
            sx={styles.wrapperStyle(themeMode)}
            ref={wrapperRef}
            onDragStart={onDragStart}
            onDrop={onDragDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
        >
            <Link href={href} className={genClassName} onContextMenu={onContextMenu} sx={styles.linkStyle(themeMode)} target="_blank" onClick={onLinkClick}>
                {children === "#" ? "" : children}
            </Link>
        </Box>
    );
}

export { NoteLink };
