import React, { useState, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import Box from "@mui/material/Box";
import { useIndexedDBTempDataUpdate } from "0-shared/hooks/useIndexedDBTempUpdate";
import { DopContextMenu } from "1-entities/components/DopContextMenu/DopContextMenu";
import { getTempDataDB } from "2-features/utils/appIndexedDB";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { setCurrentNote, setCurrentFolder } from "5-app/GlobalState/saveDataInspectStore";
import { RenderTreeAsFile } from "2-features/components/RenderTreeAsFiles/RenderTreeAsFiles";
import { ContextMenuTreeFolderContent } from "1-entities/components/ContextMenuTreeFolderContent/ContextMenuTreeFolderContent";
import type { SxProps } from "@mui/material";
import type { IDataSave, TchildrenType } from "0-shared/types/dataSave";

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
    const [isNeedUpdate, setIsNeedUpdate] = useState<boolean>(false);
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const isContextMenuOpen = Boolean(contextMenuAnchorEl);
    const nodeDataRef = useRef<TchildrenType | null>(); // запоминаем значение без лишнего обновления

    useIndexedDBTempDataUpdate(() => {
        setIsNeedUpdate(true);
    });

    // клик по ноде
    const onClickNode = (nodeData: TchildrenType, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDataTreeFolder(nodeData)) {
            dispatch(setCurrentFolder(nodeData));
        }
        if (isDataTreeNote(nodeData)) {
            dispatch(setCurrentNote(nodeData));
        }
    };

    // контекстное меню папок и заметок
    const onNodeContext = (nodeData: TchildrenType, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        nodeDataRef.current = nodeData;
        setContextMenuAnchorEl(e.currentTarget as HTMLElement);
        if (isDataTreeFolder(nodeData)) {
        }
        if (isDataTreeNote(nodeData)) {
        }
    };

    const onContextMenuClose = () => {
        setContextMenuAnchorEl(null);
        nodeDataRef.current = null;
    };

    // элементы контекстного меню
    const onRenameClick = (e: React.MouseEvent) => {
        console.log(`rename click id: ${nodeDataRef.current?.id}`);
        setContextMenuAnchorEl(null);
    };

    const onDeleteClick = (e: React.MouseEvent) => {
        console.log(`delete click id: ${nodeDataRef.current?.id}`);
        setContextMenuAnchorEl(null);
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
            <TreeView aria-label="структура заметок" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                {dataValue &&
                    RenderTreeAsFile({
                        node: dataValue.data_tree,
                        onClickNodeCallback: onClickNode,
                        onNodeContextCallback: onNodeContext,
                    })}
            </TreeView>
            <DopContextMenu isOpen={isContextMenuOpen} onClose={onContextMenuClose} anchorEl={contextMenuAnchorEl}>
                <ContextMenuTreeFolderContent onDeleteClick={onDeleteClick} onRenameClick={onRenameClick} />
            </DopContextMenu>
        </Box>
    );
}

export { FolderTreeViewer };
