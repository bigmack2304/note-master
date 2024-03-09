import React, { useRef } from "react";
import { Typography, Collapse } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { GetProps } from "0-shared/utils/typeHelpers";
import * as styles from "./NoteHeadStyles";
import "./NoteHead.scss";
import { NoteComponentMover } from "../NoteComponentMover/NoteComponentMover";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import { DragDropWrapper } from "0-shared/components/DragDropWrapper/DragDropWrapper";

type TNoteHeadProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    children?: React.ReactNode;
    typographySettings?: GetProps<typeof Typography>;
    dragId: string;
    isNoteEdit: boolean;
};

/**
 * Компонент описывает заголовок внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop children - компонент можно использовать как обертка для других компонентов.
 * @prop typographySettings - пропсы для настройки внутреннего компонента m.ui - Typography
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 * @prop dragId - id компонента (в body заметки в indexed db) в котором лежит этот компонент
 * @prop isNoteEdit - редактируется ли в данный момент заметка
 */

function NoteHead({ addClassNames = [], onClick, children, typographySettings, onContextMenu, dragId, isNoteEdit }: TNoteHeadProps) {
    const defaultClassName = "NoteHead";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(children);
    const componentRef = useRef<HTMLDivElement>(null);
    const moverRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    genClassName = useNoteComponentDrag({ wrapperRef: componentRef, containerRef: contentRef, moverRef: moverRef, dragId, fullClassName: genClassName });

    const classNameGen = () => {
        let tempClassName = genClassName.split(" ");

        if (!isChildren) {
            tempClassName.push("text_empty");
        }

        genClassName = tempClassName.join(" ");
    };
    classNameGen();

    return (
        <DragDropWrapper ref={componentRef}>
            <Collapse in={isNoteEdit} orientation="vertical">
                <NoteComponentMover ref={moverRef} />
            </Collapse>
            <Typography
                {...typographySettings}
                className={genClassName}
                variant={styles.typographyVariant(addClassNames)}
                onContextMenu={onContextMenu}
                onClick={onClick}
                sx={styles.typographyStyle(themeMode)}
                ref={contentRef}
            >
                {children}
            </Typography>
        </DragDropWrapper>
    );
}

export { NoteHead };
export type { TNoteHeadProps };
