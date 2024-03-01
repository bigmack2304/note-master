import React from "react";
import Link from "@mui/material/Link";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import * as styles from "./NoteLinkStyles";

type TNoteLinkProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent, href: string, children: string) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    href: string;
    label: string;
    isLabel: boolean;
};

/**
 * Компонент описывает заголовок внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 * @prop href - адрес ссылки
 * @prop label - текст ссылки
 * @prop isLabel - если true то текст ссылки = label, иначе href
 */
function NoteLink({ addClassNames = [], onClick, href, onContextMenu, isLabel, label }: TNoteLinkProps) {
    const defaultClassName = "NoteLink";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const children = isLabel ? label : href;
    const isChildren = Boolean(children !== "" && children !== "#");

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
        <Link href={href} className={genClassName} onContextMenu={onContextMenu} sx={styles.linkStyle(isChildren, themeMode)} target="_blank" onClick={onLinkClick}>
            {children === "#" ? "" : children}
        </Link>
    );
}

export { NoteLink };
