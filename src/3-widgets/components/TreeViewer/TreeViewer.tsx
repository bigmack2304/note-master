import React, { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material";
import { useIndexedDBTempDataUpdate } from "0-shared/hooks/useIndexedDBTempUpdate";
import { getTempDataDB } from "2-features/utils/appIndexedDB";
import type { IDataSave, IDataTreeFolder, TchildrenType, IDataTreeNote, nodeType } from "0-shared/types/dataSave";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { setCurrentNote, setCurrentFolder } from "5-app/GlobalState/saveDataInspectStore";

type TTreeViewerProps = {};

const treeViewerStyle: SxProps = {
    flexGrow: "1",
    maxWidth: "300px",
    borderRight: "1px #0000005c solid",
    backgroundColor: "#1a1c5017",
    whiteSpace: "nowrap",
    overflow: "auto",
    padding: "10px 0 0 5px",
};

function TreeViewer({}: TTreeViewerProps) {
    const [dataValue, setDataValue] = useState<IDataSave>();
    const [isNeedUpdate, setIsNeedUpdate] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useIndexedDBTempDataUpdate(() => {
        setIsNeedUpdate(true);
    });

    if (isNeedUpdate) {
        getTempDataDB({
            callback: (val) => {
                setDataValue(val);
                setIsNeedUpdate(false);
                console.dir(val);
            },
        });
    }

    const renderTree = (nodes: TchildrenType | undefined) => {
        if (!nodes) return <></>;

        type obj = {
            [x: string]: any;
        };
        let nodeData: IDataTreeNote | Omit<IDataTreeFolder, "children"> | obj = {};

        (function () {
            for (let key in nodes) {
                if (key === "children") continue;

                nodeData[key] = (nodes as any)[key];
            }
        })();

        const onClick = () => {
            console.dir(nodeData);
            if ((nodeData.type as nodeType) === "folder") {
                dispatch(setCurrentFolder(nodeData as Omit<IDataTreeFolder, "children">));
            }
            if ((nodeData.type as nodeType) === "note") {
                dispatch(setCurrentNote(nodeData as IDataTreeNote));
            }
        };

        return (
            <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name} onClick={onClick}>
                {"children" in nodes && Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
            </TreeItem>
        );
    };

    return (
        <Box sx={treeViewerStyle}>
            <TreeView aria-label="rich object" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpanded={["root"]} defaultExpandIcon={<ChevronRightIcon />}>
                {renderTree(dataValue?.data_tree)}
            </TreeView>
        </Box>
    );
}

export { TreeViewer };
