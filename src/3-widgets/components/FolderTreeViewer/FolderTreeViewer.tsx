import React, { useState, useRef, useCallback } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { MemoTreeView, CustomTreeView } from "1-entities/components/CustomTreeView/CustomTreeView";
import Box from "@mui/material/Box";
import { useIndexedDBTempDataUpdate } from "0-shared/hooks/useIndexedDBTempUpdate";
import { DopContextMenu } from "1-entities/components/DopContextMenu/DopContextMenu";
import { getTempDataDB } from "2-features/utils/appIndexedDB";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { setCurrentNote, setCurrentFolder, deleteNoteOrFolder, renameNodeName } from "5-app/GlobalState/saveDataInspectStore";
import { RenderTreeAsFile } from "2-features/components/RenderTreeAsFiles/RenderTreeAsFiles";
import { ContextMenuTreeFolderContent } from "1-entities/components/ContextMenuTreeFolderContent/ContextMenuTreeFolderContent";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import type { SxProps } from "@mui/material";
import type { IDataSave, TchildrenType } from "0-shared/types/dataSave";
import { ContextMenuTreeNoteContent } from "1-entities/components/ContextMenuTreeNoteContent/ContextMenuTreeNoteContent";
import { TreeItemRenameDialog } from "2-features/components/TreeItemRenameDialog/TreeItemRenameDialog";

type TFolderTreeViewerProps = {};

const FolderTreeViewerStyle: SxProps = {
    flexGrow: "1",
    maxWidth: "300px",
    borderRight: "1px #0000005c solid",
    backgroundColor: "#1a1c5017",
    whiteSpace: "nowrap",
    overflow: "auto",
    padding: "10px 0 0 5px",
};

/**
 * рендерит содержимое tempData из indexed db, в виде папок и фаилов
 * @returns
 */
function FolderTreeViewer({}: TFolderTreeViewerProps) {
    const [dataValue, setDataValue] = useState<IDataSave>();
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState<boolean>(false);
    const [renamedItemName, setRenamedItemName] = useState<string>("");
    const [isNeedUpdate, setIsNeedUpdate] = useState<boolean>(false);
    const currentNote = useAppSelector((state) => state.saveDataInspect.currentNote);
    const currentFolder = useAppSelector((state) => state.saveDataInspect.currentFolder);
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const isContextMenuOpen = Boolean(contextMenuAnchorEl);
    const clickedNodeDataRef = useRef<TchildrenType | null>(); // нода tempData по которой был клик, апоминаем значение без лишнего обновления

    useIndexedDBTempDataUpdate(() => {
        setIsNeedUpdate(true);
        console.log("db upd");
    });

    // клик по ноде
    const onClickNode = (nodeData: TchildrenType, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDataTreeFolder(nodeData)) {
            if (currentFolder && currentFolder.id === nodeData.id) return;
            dispatch(setCurrentFolder(nodeData));
        }
        if (isDataTreeNote(nodeData)) {
            if (currentNote && currentNote.id === nodeData.id) return;
            dispatch(setCurrentNote(nodeData));
        }
    };

    // контекстное меню папок и заметок
    const onNodeContext = (nodeData: TchildrenType, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        clickedNodeDataRef.current = nodeData;
        setContextMenuAnchorEl(e.currentTarget as HTMLElement);
    };

    const onContextMenuClose = () => {
        setContextMenuAnchorEl(null);
    };

    // элементы контекстного меню
    const onRenameClick = (e: React.MouseEvent) => {
        setContextMenuAnchorEl(null);

        if (!clickedNodeDataRef.current || !dataValue) return;
        setIsRenameDialogOpen(true);
        setRenamedItemName(clickedNodeDataRef.current.name);
    };

    const onDeleteClick = (e: React.MouseEvent) => {
        setContextMenuAnchorEl(null);
        if (!clickedNodeDataRef.current || !dataValue) return;
        dispatch(deleteNoteOrFolder({ nodeId: clickedNodeDataRef.current.id }));
    };

    const onNewFolderClick = (e: React.MouseEvent) => {
        setContextMenuAnchorEl(null);
    };

    const onNewNoteClick = (e: React.MouseEvent) => {
        setContextMenuAnchorEl(null);
    };

    // функции Rename Dialog
    const onCloseRDialog = () => {
        setIsRenameDialogOpen(false);
    };

    const onSaveCloseRDialog = (newValue: string) => {
        setIsRenameDialogOpen(false);
        if (!clickedNodeDataRef.current) return;
        dispatch(renameNodeName({ newName: newValue, nodeId: clickedNodeDataRef.current.id }));
    };

    // получение данных из IndexedDB
    if (isNeedUpdate) {
        getTempDataDB({
            callback: (val) => {
                setDataValue(val);
                setIsNeedUpdate(false);
            },
        });
    }

    return (
        <Box sx={FolderTreeViewerStyle}>
            <CustomTreeView TreeViewSettings={{ "aria-label": "структура заметок", defaultCollapseIcon: <ExpandMoreIcon />, defaultExpandIcon: <ChevronRightIcon /> }}>
                {RenderTreeAsFile({
                    node: dataValue?.data_tree,
                    onClickNodeCallback: onClickNode,
                    onNodeContextCallback: onNodeContext,
                })}
            </CustomTreeView>
            <DopContextMenu isOpen={isContextMenuOpen} onClose={onContextMenuClose} anchorEl={contextMenuAnchorEl}>
                {clickedNodeDataRef.current && isDataTreeFolder(clickedNodeDataRef.current) ? (
                    <ContextMenuTreeFolderContent
                        onDeleteClick={onDeleteClick}
                        onRenameClick={onRenameClick}
                        onNewFolderClick={onNewFolderClick}
                        onNewNoteClick={onNewNoteClick}
                        isDelDisabled={clickedNodeDataRef.current && clickedNodeDataRef.current.id === "root" ? true : false}
                    />
                ) : clickedNodeDataRef.current && isDataTreeNote(clickedNodeDataRef.current) ? (
                    <ContextMenuTreeNoteContent onDeleteClick={onDeleteClick} onRenameClick={onRenameClick} />
                ) : null}
            </DopContextMenu>

            {isRenameDialogOpen && <TreeItemRenameDialog dialogHeader="Изменить имя" inputDefValue={renamedItemName} onClose={onCloseRDialog} onCloseSave={onSaveCloseRDialog} />}
        </Box>
    );
}

export { FolderTreeViewer };
