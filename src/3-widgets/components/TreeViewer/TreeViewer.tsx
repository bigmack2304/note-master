import React, { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material";
import { useIndexedDBTempDataUpdate } from "0-shared/hooks/useIndexedDBTempUpdate";
import { getTempDataDB } from "2-features/utils/appIndexedDB";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import type { IDataSave, TchildrenType } from "0-shared/types/dataSave";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import {
  setCurrentNote,
  setCurrentFolder,
} from "5-app/GlobalState/saveDataInspectStore";
import { RenderTreeAsFile } from "2-features/components/RenderTreeAsFiles/RenderTreeAsFiles";

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

  const onClickNode = (nodeData: TchildrenType) => {
    if (isDataTreeFolder(nodeData)) {
      dispatch(setCurrentFolder(nodeData));
    }
    if (isDataTreeNote(nodeData)) {
      dispatch(setCurrentNote(nodeData));
    }
  };

  if (isNeedUpdate) {
    getTempDataDB({
      callback: (val) => {
        setDataValue(val);
        setIsNeedUpdate(false);
      },
    });
  }

  return (
    <Box sx={treeViewerStyle}>
      <TreeView
        aria-label="структура заметок"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {dataValue &&
          RenderTreeAsFile({
            node: dataValue.data_tree,
            onClickNodeCallback: onClickNode,
          })}
      </TreeView>
    </Box>
  );
}

export { TreeViewer };
