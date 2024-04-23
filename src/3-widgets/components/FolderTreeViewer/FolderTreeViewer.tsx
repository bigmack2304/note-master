import React, { useState, useRef, useMemo, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view";
import Box from "@mui/material/Box";
import { DopContextMenu } from "1-entities/components/DopContextMenu/DopContextMenu";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import CircularProgress from "@mui/material/CircularProgress";
import {
    setCurrentNote,
    setCurrentFolder,
    deleteNoteOrFolder,
    renameNodeName,
    addFolder,
    addNote,
    moveFolderOrNote,
} from "5-app/GlobalState/saveDataInspectStore";
import { RenderTreeAsFile } from "1-entities/components/RenderTreeAsFiles/RenderTreeAsFiles";
import { ContextMenuTreeFolderContent } from "1-entities/components/ContextMenuTreeFolderContent/ContextMenuTreeFolderContent";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import type { TchildrenType, IDataTreeFolder, IDataTreeRootFolder } from "0-shared/types/dataSave";
import { ContextMenuTreeNoteContent } from "1-entities/components/ContextMenuTreeNoteContent/ContextMenuTreeNoteContent";
import { TreeItemRenameDialog } from "2-features/components/TreeItemRenameDialog/TreeItemRenameDialog";
import { TreeAddFolderDialog } from "2-features/components/TreeAddFolderDialog/TreeAddFolderDialog";
import { TreeAddNoteDialog } from "2-features/components/TreeAddNoteDialog/TreeAddNoteDialog";
import { TreeItemMoveDialog } from "2-features/components/TreeItemMoveDialog/TreeItemMoveDialog";
import { useDataTree } from "0-shared/hooks/useDataTree";
import { getParentFolder } from "2-features/utils/saveDataParse";
import { useEventListener } from "0-shared/hooks/useEventListener";
import { EV_NAME_LINK_NOTE_REDIRECT, EV_NAME_BUTTON_CLOSE_TREE_FOLDERS } from "5-app/settings";
import { runTaskOnWorker } from "0-shared/dedicatedWorker/workerFuncs";
import { workerRef } from "0-shared/dedicatedWorker/workerInit";
import "./FolderfTreeViewer.scss";
import type { TMessageCloneFiltredTreeOnWorker } from "0-shared/dedicatedWorker/workerTypes";
import type { TReturnTypeCloneFiltredTree } from "0-shared/utils/note_find";

type TFolderTreeViewerProps = {};

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
    const [treeNodeSelect, setTreeNodeSelect] = useState<string>("");
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
    const currentNote = useAppSelector((state) => state.saveDataInspect.currentNote);
    const currentFolder = useAppSelector((state) => state.saveDataInspect.currentFolder);
    const findParams = useAppSelector((state) => state.toolBar.findNodeTree);
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const isContextMenuOpen = Boolean(contextMenuAnchorEl);
    const clickedNodeDataRef = useRef<TchildrenType | null>(); // нода tempData по которой был клик при открытии контекстного меню, зпоминаем значение без лишнего обновления
    const [isLoading, setIsLoading] = useState(false);
    const [prepDataTree, setprepDataTree] = useState(dataTree);

    // клик по ноде (для кастомных элементов дерева)
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

    // выбор ноды
    const ontreeNodeSelect = (event: React.SyntheticEvent, nodeIds: string) => {
        setTreeNodeSelect(nodeIds);

        // получаем родительскую папку для этой ноды, делаем ее активной, раскрываем все вышестоящие папки до этой ноды
        if (dataTree) {
            const parentFolder = getParentFolder(dataTree, nodeIds);
            if (parentFolder) {
                if (isDataTreeFolder(parentFolder)) {
                    dispatch(setCurrentFolder(parentFolder));

                    let expNodes = [...expandedNodes];
                    const openParent = (itemID: string) => {
                        if (!expNodes.includes(itemID)) {
                            expNodes.push(itemID);

                            let parent = getParentFolder(dataTree, parentFolder.id);
                            if (parent) openParent(parent.id);
                        }
                    };
                    openParent(parentFolder.id);
                    setExpandedNodes(expNodes);
                }
            }
        }
    };

    // разворачивание ноды
    const onNodeExpand = (event: React.SyntheticEvent, nodeIds: string[]) => {
        //TODO: expanded: [] в TreeViewSettings сворачивает всю фаиловую структуру
        setExpandedNodes(nodeIds);
    };

    // при нажатии на кнопку закрыть папки, генерируется событие, реагируем на него
    useEventListener({
        eventName: EV_NAME_BUTTON_CLOSE_TREE_FOLDERS,
        onEvent: (e: CustomEvent) => {
            setExpandedNodes([]);
        },
    });

    // при переходе по ссылке на заметку, переключаем тут активную ноду
    useEventListener({
        eventName: EV_NAME_LINK_NOTE_REDIRECT,
        onEvent: (e: CustomEvent) => {
            if (e.detail.id) setTreeNodeSelect(e.detail.id);

            // получаем родительскую папку для этой ноды, делаем ее активной, раскрываем все вышестоящие папки до этой ноды
            if (dataTree) {
                const parentFolder = getParentFolder(dataTree, e.detail.id);
                if (parentFolder) {
                    if (isDataTreeFolder(parentFolder)) {
                        // useEventListener в данном случае отрабатывает вместе с редьюсерами, поэтому dispatch помещаю в стек макро-задачь чтоб redux не выдал ошибку
                        setTimeout(() => {
                            dispatch(setCurrentFolder(parentFolder));
                        });
                        let expNodes = [...expandedNodes];
                        const openParent = (itemID: string) => {
                            if (!expNodes.includes(itemID)) {
                                expNodes.push(itemID);
                            }
                            let parent = getParentFolder(dataTree, itemID);

                            if (parent) openParent(parent.id);
                        };
                        openParent(parentFolder.id);
                        setExpandedNodes(expNodes);
                    }
                }
            }
        },
    });

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

    useEffect(() => {
        if (!findParams) {
            setprepDataTree(dataTree);
        } else {
            if (dataTree) {
                setIsLoading(true);
                const awaitData = async () => {
                    if (!workerRef.DWorker) return;
                    const [cloned, folders] = await runTaskOnWorker<TMessageCloneFiltredTreeOnWorker, TReturnTypeCloneFiltredTree>(
                        workerRef.DWorker,
                        {
                            type: "clone filtred tree",
                            args: [dataTree, findParams],
                        }
                    );
                    let tempExpandedNodes = [...expandedNodes];
                    let isUpd = false;

                    for (let folder of folders) {
                        if (!expandedNodes.includes(folder)) {
                            tempExpandedNodes.push(folder);
                            isUpd = true;
                        }
                    }

                    if (isUpd) {
                        setExpandedNodes(tempExpandedNodes);
                    }

                    setIsLoading(false);
                    setprepDataTree(cloned as any as IDataTreeRootFolder);
                };
                awaitData();
            } else {
                setprepDataTree(dataTree);
            }
        }
    }, [findParams, dataTree]);

    return (
        <Box className="FolderTreeViewer">
            {isLoading ? (
                <CircularProgress />
            ) : (
                <>
                    <TreeView
                        aria-label="структура заметок"
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        selected={treeNodeSelect}
                        onNodeSelect={ontreeNodeSelect}
                        expanded={expandedNodes}
                        onNodeToggle={onNodeExpand}
                    >
                        {RenderTreeAsFile({
                            node: prepDataTree,
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
                            <ContextMenuTreeNoteContent
                                onDeleteClick={onDeleteClick}
                                onRenameClick={onRenameClick}
                                onMoveClick={onMoveClick}
                            />
                        ) : null}
                    </DopContextMenu>

                    {isRenameDialogOpen && (
                        <TreeItemRenameDialog inputDefValue={contextNodeName} onClose={onCloseRDialog} onCloseSave={onSaveCloseRDialog} />
                    )}
                    {isNewFolderDialogOpen && <TreeAddFolderDialog onClose={onCloseNFDialog} onCloseSave={onSaveCloseNFDialog} />}
                    {isNewNoteDialogOpen && <TreeAddNoteDialog onClose={onCloseNNDialog} onCloseSave={onSaveCloseNNDialog} />}
                    {isMoveDialogOpen && (
                        <TreeItemMoveDialog muvedFileName={contextNodeName} onClose={onCloseMNDialog} onCloseSave={onSaveCloseMNDialog} />
                    )}
                </>
            )}
        </Box>
    );
}

export { FolderTreeViewer };
