import React, { useRef } from "react";
import Typography from "@mui/material/Typography";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { GetProps } from "0-shared/utils/typeHelpers";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import * as styles from "./NoteHeadStyles";
import "./styles.scss";

type TNoteHeadProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    children?: React.ReactNode;
    typographySettings?: GetProps<typeof Typography>;
    dragId: string;
};

/**
 * Компонент описывает заголовок внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop children - компонент можно использовать как обертка для других компонентов.
 * @prop typographySettings - пропсы для настройки внутреннего компонента m.ui - Typography
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 * @prop dragId - id компонента (в body заметки в indexed db) в котором лежит этот компонент
 */
function NoteHead({ addClassNames = [], onClick, children, typographySettings, onContextMenu, dragId }: TNoteHeadProps) {
    const defaultClassName = "NoteHead";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(children);
    const ref = useRef<HTMLHeadElement>(null);
    const { onDragStart, onDragDrop, onDragOver, onDragLeave, onDragEnd } = useNoteComponentDrag({ ref, dragId });

    // если children пуст, то добавляем в Typography класс text_empty
    if (!isChildren) {
        let tempClassName = genClassName.split(" ");
        tempClassName.push("text_empty");
        genClassName = tempClassName.join(" ");
    }

    return (
        <Typography
            {...typographySettings}
            className={genClassName}
            variant={styles.typographyVariant(addClassNames)}
            onContextMenu={onContextMenu}
            onClick={onClick}
            sx={styles.typographyStyle(themeMode)}
            ref={ref}
            onDragStart={onDragStart}
            onDrop={onDragDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
        >
            {children}
        </Typography>
    );
}

export { NoteHead };
export type { TNoteHeadProps };
