import React, { useRef } from "react";
import { Box, Collapse } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { NoteComponentMover } from "0-shared/components/NoteComponentMover/NoteComponentMover";
import { useNoteComponentDrag } from "0-shared/hooks/useNoteComponentDrag";
import * as styles from "./NoteTableStyle";
import "./NoteTable.scss";
import { DragDropWrapper } from "0-shared/components/DragDropWrapper/DragDropWrapper";
import { Table } from "../Table/Table";
import type { TTableValue, TBodyComponentTable } from "0-shared/types/dataSave";

type TNoteTableProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    tableData?: TTableValue | null;
    tableDesc?: TBodyComponentTable["desc"];
    isLoading?: boolean;
    tableViewControls?: TBodyComponentTable["viewButtons"];
    backLight?: TBodyComponentTable["backlight"];
    dragId: string;
    isNoteEdit: boolean;
};

/**
 * таблица внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick вызывается при клике по всему окну
 * @prop onContextMenu вызывается при клике левой кнопкой мыши по всему окну
 * @prop tableData содержимое таблицы
 * @prop tableDesc - дублирует это своиство из TBodyComponentTable
 * @prop isLoading если true то отображает значок загрузки
 * @prop isNoteEdit - редактируется ли в данный момент заметка
 * @prop dragId - id компонента (или любой уникальный id)
 * @prop tableViewControls - дублирует это своиство из TBodyComponentTable
 * @prop backLight - дублирует это своиство из TBodyComponentTable
 */
function NoteTable({
    addClassNames = [],
    onClick,
    onContextMenu,
    tableData,
    isLoading = false,
    dragId,
    isNoteEdit,
    tableDesc = "",
    tableViewControls,
    backLight,
}: TNoteTableProps) {
    const defaultClassName = "NoteTable";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(tableData);
    const componentRef = useRef<HTMLDivElement>(null);
    const moverRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapClassName = useNoteComponentDrag({ wrapperRef: componentRef, containerRef: contentRef, moverRef: moverRef, dragId, fullClassName: "NoteTable__out_wrapper" });

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
            <Box ref={contentRef} className={wrapClassName} sx={styles.outWrapperStyle(themeMode)}>
                <div className="NoteTable__inner_wrapper">
                    <Box component={"div"} className={genClassName} sx={styles.noteTableStyle(themeMode)} onContextMenu={onContextMenu} onClick={onClick}>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                {isChildren && (
                                    <Table tableRenderData={tableData!} editMode={false} tableDesc={tableDesc} tableViewControls={tableViewControls} backLight={backLight} />
                                )}
                            </>
                        )}
                    </Box>
                </div>
            </Box>
        </DragDropWrapper>
    );
}

export { NoteTable };
export type { TNoteTableProps };
