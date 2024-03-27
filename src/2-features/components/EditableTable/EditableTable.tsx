import React, { useState, useEffect } from "react";
import { ClosableOneLineTextInput } from "2-features/components/ClosableOneLineTextInput/ClosableOneLineTextInput";
import { NoteHead } from "0-shared/components/NoteHead/NoteHead";
import { DopContextMenuFree } from "1-entities/components/DopContextMenuFree/DopContextMenuFree";
import { ContextMenuEditContent } from "1-entities/components/ContextMenuEditContent/ContextMenuEditContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteComponentValue, deleteNoteComponent, updateNoteComponentTableDbSettings, updateNoteComponentTableDbData } from "5-app/GlobalState/saveDataInspectStore";
import { TableEditWindow } from "../TableEditWindow/TableEditWindow";
import type { TBodyComponentTable, TTableValue } from "0-shared/types/dataSave";
import { useTableValue } from "0-shared/hooks/useTableValue";
import { NoteTable } from "../NoteTable/NoteTable";
import { NoteTableEditDialog } from "../NoteTableEditDialog/NoteTableEditDialog";
import "./EditableTable.scss";

type TEditableTableProps = {
    addClassNames?: string[];
    componentData: TBodyComponentTable;
};

const genTextDopClasses = (data: { isEdit: boolean; aligin: TBodyComponentTable["aligin"] }) => {
    const classes: string[] = [];

    if (data.isEdit) {
        classes.push("NoteTable--editable");
    }

    if (data.aligin === "left") {
        classes.push("NoteTable--aligin_left");
    }

    if (data.aligin === "right") {
        classes.push("NoteTable--aligin_right");
    }

    if (data.aligin === "center") {
        classes.push("NoteTable--aligin_center");
    }

    return classes;
};

/**
 * Заголовок заметки с поддержкой редактирования
 * @prop defaultText - значение по умолчанию
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function EditableTable({ addClassNames = [], componentData }: TEditableTableProps) {
    const [isEdit, setIsEdit] = useState(false);
    const [clickData, setClickData] = React.useState<{ x: number; y: number } | null>(null);
    const dispatch = useAppDispatch();
    const [isTableEditDialog, setIsTableEditDialog] = useState(false);
    let currentNoteData = useAppSelector((state) => state.saveDataInspect.currentNote);
    let isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);
    const tableValue = useTableValue({ componentTableID: componentData.id });

    // вычесляем дополнительгые классы для таблицы в режиме просмотра
    let textDopClasses = genTextDopClasses({
        isEdit: isNoteEdit,
        aligin: componentData.aligin,
    });

    useEffect(() => {
        if (!isNoteEdit) {
            setIsEdit(false);
        }
    }, [isNoteEdit]);

    const onClickMoreActions = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        setClickData(
            clickData === null
                ? {
                      x: e.clientX + 2,
                      y: e.clientY - 6,
                  }
                : null
        );
    };

    const onMenuClose = () => {
        setClickData(null);
    };

    // клики в меню опций
    const onMenuEdit = () => {
        setIsEdit(true);
        setClickData(null);
    };

    const onMenuClear = () => {
        setClickData(null);

        if (!componentData || !currentNoteData) return;
        dispatch(updateNoteComponentTableDbData({ noteId: currentNoteData.id, componentId: componentData.id, newValue: "" }));
        dispatch(
            updateNoteComponentTableDbSettings({
                noteId: currentNoteData.id,
                componentId: componentData.id,
                desc: "",
                backlight: componentData.backlight,
                viewButtons: componentData.viewButtons,
                aligin: componentData.aligin,
            })
        );
    };

    const onMenuDelete = () => {
        if (!componentData || !currentNoteData) return;
        dispatch(deleteNoteComponent({ noteId: currentNoteData.id, componentId: componentData.id }));
    };

    const onMenuParams = () => {
        setClickData(null);
        setIsTableEditDialog(true);
    };

    // клики в форме редактирования
    const onEditExit = (isChange: boolean, tableValue: TTableValue) => {
        setIsEdit(false);

        if (!componentData || !currentNoteData || !isChange) return;
        dispatch(updateNoteComponentTableDbData({ noteId: currentNoteData.id, componentId: componentData.id, newValue: tableValue }));
    };

    // функции окна с вормой настроек заголовка

    const onEditHeaderDialogClose = () => {
        setIsTableEditDialog(false);
    };

    const onEditHeaderDialogCloseSave = (data: {
        backlight: TBodyComponentTable["backlight"];
        descValue: TBodyComponentTable["desc"];
        viewButtons: TBodyComponentTable["viewButtons"];
        aligin: TBodyComponentTable["aligin"];
    }) => {
        setIsTableEditDialog(false);
        if (!componentData || !currentNoteData) return;
        dispatch(
            updateNoteComponentTableDbSettings({
                componentId: componentData.id,
                noteId: currentNoteData.id,
                backlight: data.backlight,
                desc: data.descValue,
                viewButtons: data.viewButtons,
                aligin: data.aligin,
            })
        );
    };

    return (
        <>
            {isEdit ? (
                <TableEditWindow isOpen={true} onClose={onEditExit} tableData={tableValue} addClassNames={["EditableTable__editMod"]} backLight={componentData.backlight} />
            ) : (
                <>
                    <NoteTable
                        addClassNames={[...addClassNames, ...textDopClasses]}
                        onContextMenu={onClickMoreActions}
                        dragId={componentData.id}
                        isNoteEdit={isNoteEdit}
                        tableData={tableValue}
                        tableDesc={componentData.desc}
                        backLight={componentData.backlight}
                        tableViewControls={componentData.viewButtons}
                    />

                    <DopContextMenuFree onClose={onMenuClose} mousePos={clickData}>
                        <ContextMenuEditContent
                            onEditClick={onMenuEdit}
                            onClearClick={onMenuClear}
                            onDeleteClick={onMenuDelete}
                            onParamsClick={onMenuParams}
                            isClearDisabled={tableValue !== null ? false : true}
                            isAllDisabled={!isNoteEdit}
                        />
                    </DopContextMenuFree>
                    {isTableEditDialog && <NoteTableEditDialog onClose={onEditHeaderDialogClose} onCloseSave={onEditHeaderDialogCloseSave} componentData={componentData} />}
                </>
            )}
        </>
    );
}

export { EditableTable };
