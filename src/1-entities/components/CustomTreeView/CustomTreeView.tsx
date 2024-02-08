import React from "react";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { GetProps } from "0-shared/utils/typeHelpers";

type TTreeViewProps = GetProps<typeof TreeView>;

type TCustomTreeViewProps = {
    TreeViewSettings?: TTreeViewProps;
    children?: TTreeViewProps["children"];
};

function CustomTreeView({ TreeViewSettings = {}, children }: TCustomTreeViewProps) {
    return (
        <>
            <TreeView {...TreeViewSettings}>{children}</TreeView>
        </>
    );
}

const MemoTreeView = React.memo(CustomTreeView);

export { CustomTreeView, MemoTreeView };
