import React, { useState, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view";
import Box from "@mui/material/Box";
import { DopContextMenu } from "1-entities/components/DopContextMenu/DopContextMenu";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { setCurrentNote, setCurrentFolder, deleteNoteOrFolder, renameNodeName, addFolder, addNote, moveFolderOrNote } from "5-app/GlobalState/saveDataInspectStore";
import { RenderTreeAsFile } from "1-entities/components/RenderTreeAsFiles/RenderTreeAsFiles";
import { ContextMenuTreeFolderContent } from "1-entities/components/ContextMenuTreeFolderContent/ContextMenuTreeFolderContent";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import type { SxProps } from "@mui/material";
import type { TchildrenType, IDataTreeFolder } from "0-shared/types/dataSave";
import { ContextMenuTreeNoteContent } from "1-entities/components/ContextMenuTreeNoteContent/ContextMenuTreeNoteContent";
import { TreeItemRenameDialog } from "2-features/components/TreeItemRenameDialog/TreeItemRenameDialog";
import { TreeAddFolderDialog } from "2-features/components/TreeAddFolderDialog/TreeAddFolderDialog";
import { TreeAddNoteDialog } from "2-features/components/TreeAddNoteDialog/TreeAddNoteDialog";
import { TreeItemMoveDialog } from "2-features/components/TreeItemMoveDialog/TreeItemMoveDialog";
import { useDataTree } from "0-shared/hooks/useDataTree";

type TFolderTreeViewerProps = {};

const FolderTreeViewerStyle: SxProps = {
    borderRight: "1px #0000005c solid",
    backgroundColor: "#1a1c5017",
    whiteSpace: "nowrap",
    overflow: "auto",
    padding: "10px 0 0 5px",
    height: "100%",
    width: "100%",
};

/**
 * рендерит содержимое tempData из indexed db, в виде папок и фаилов
 * @returns
 */
function FolderTreeViewer({}: TFolderTreeViewerProps) {
    const dataTree = useDataTree();
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState<boolean>(false);
    const [contextNodeName, setContextNodeName] = useState<string>(""); // имя ноды на которой открывается контекстное меню
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState<boolean>(false);
    const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState<boolean>(false);
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState<boolean>(false);
    const currentNote = useAppSelector((state) => state.saveDataInspect.currentNote);
    const currentFolder = useAppSelector((state) => state.saveDataInspect.currentFolder);
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const isContextMenuOpen = Boolean(contextMenuAnchorEl);
    const clickedNodeDataRef = useRef<TchildrenType | null>(); // нода tempData по которой был клик при открытии контекстного меню, зпоминаем значение без лишнего обновления

    // клик по ноде
    //TODO: возможно потом стоит переделать это на onNodeSelect
    const onClickNode = (nodeData: TchildrenType) => {
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

        if (!clickedNodeDataRef.current || !dataTree) return;
        setIsRenameDialogOpen(true);
        setContextNodeName(clickedNodeDataRef.current.name);
    };

    const onDeleteClick = (e: React.MouseEvent) => {
        setContextMenuAnchorEl(null);
        if (!clickedNodeDataRef.current || !dataTree) return;
        dispatch(deleteNoteOrFolder({ nodeId: clickedNodeDataRef.current.id }));
    };

    const onNewFolderClick = (e: React.MouseEvent) => {
        setContextMenuAnchorEl(null);

        if (!clickedNodeDataRef.current || !dataTree) return;
        setIsNewFolderDialogOpen(true);
    };

    const onNewNoteClick = (e: React.MouseEvent) => {
        setContextMenuAnchorEl(null);

        if (!clickedNodeDataRef.current || !dataTree) return;
        setIsNewNoteDialogOpen(true);
        dispatch(setCurrentNote(undefined)); // сбрасываем активную заметку если пытаемся создать новую. На этой логике работает форма выставления тегов
    };

    const onMoveClick = (e: React.MouseEvent) => {
        setContextMenuAnchorEl(null);

        if (!clickedNodeDataRef.current || !dataTree) return;
        setIsMoveDialogOpen(true);
        setContextNodeName(clickedNodeDataRef.current.name);
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

    // функции new folder Dialog
    const onCloseNFDialog = () => {
        setIsNewFolderDialogOpen(false);
    };

    const onSaveCloseNFDialog = (inputValue: string) => {
        setIsNewFolderDialogOpen(false);
        if (!clickedNodeDataRef.current) return;
        dispatch(addFolder({ insertToId: clickedNodeDataRef.current.id, nodeName: inputValue, color: "" }));
    };

    // функции new note Dialog
    const onCloseNNDialog = () => {
        setIsNewNoteDialogOpen(false);
    };

    const onSaveCloseNNDialog = (inputValue: string, selectValue: string[] | string) => {
        setIsNewNoteDialogOpen(false);
        if (!clickedNodeDataRef.current) return;
        dispatch(addNote({ insertToId: clickedNodeDataRef.current.id, nodeName: inputValue, tags: selectValue }));
    };

    // функции move node dialog
    const onCloseMNDialog = () => {
        setIsMoveDialogOpen(false);
    };

    const onSaveCloseMNDialog = (inputValue: string, selectFolderJSON: string) => {
        setIsMoveDialogOpen(false);
        const objFolder = JSON.parse(selectFolderJSON) as IDataTreeFolder;
        if (!clickedNodeDataRef.current || !objFolder) return;
        dispatch(moveFolderOrNote({ muvedNodeID: clickedNodeDataRef.current.id, muveToID: objFolder.id }));
    };

    //TODO: expanded: [] в TreeViewSettings сворачивает всю фаиловую структуру
    return (
        <Box sx={FolderTreeViewerStyle}>
            <TreeView aria-label="структура заметок" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                {RenderTreeAsFile({
                    node: dataTree,
                    onClickNodeCallback: onClickNode,
                    onNodeContextCallback: onNodeContext,
                })}
            </TreeView>
            <DopContextMenu isOpen={isContextMenuOpen} onClose={onContextMenuClose} anchorEl={contextMenuAnchorEl}>
                {clickedNodeDataRef.current && isDataTreeFolder(clickedNodeDataRef.current) ? (
                    <ContextMenuTreeFolderContent
                        onDeleteClick={onDeleteClick}
                        onRenameClick={onRenameClick}
                        onNewFolderClick={onNewFolderClick}
                        onNewNoteClick={onNewNoteClick}
                        onMoveClick={onMoveClick}
                        isDelDisabled={clickedNodeDataRef.current && clickedNodeDataRef.current.id === "root" ? true : false}
                        isRenDisabled={clickedNodeDataRef.current && clickedNodeDataRef.current.id === "root" ? true : false}
                        isMowDisabled={clickedNodeDataRef.current && clickedNodeDataRef.current.id === "root" ? true : false}
                    />
                ) : clickedNodeDataRef.current && isDataTreeNote(clickedNodeDataRef.current) ? (
                    <ContextMenuTreeNoteContent onDeleteClick={onDeleteClick} onRenameClick={onRenameClick} onMoveClick={onMoveClick} />
                ) : null}
            </DopContextMenu>

            {isRenameDialogOpen && <TreeItemRenameDialog inputDefValue={contextNodeName} onClose={onCloseRDialog} onCloseSave={onSaveCloseRDialog} />}
            {isNewFolderDialogOpen && <TreeAddFolderDialog onClose={onCloseNFDialog} onCloseSave={onSaveCloseNFDialog} />}
            {isNewNoteDialogOpen && <TreeAddNoteDialog onClose={onCloseNNDialog} onCloseSave={onSaveCloseNNDialog} />}
            {isMoveDialogOpen && <TreeItemMoveDialog muvedFileName={contextNodeName} onClose={onCloseMNDialog} onCloseSave={onSaveCloseMNDialog} />}
        </Box>
    );
}

export { FolderTreeViewer };
