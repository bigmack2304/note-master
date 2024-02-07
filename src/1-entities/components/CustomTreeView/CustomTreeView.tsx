import React from "react";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { GetProps } from "0-shared/utils/typeHelpers";

type TTreeViewProps = GetProps<typeof TreeView>;

type TCustomTreeViewProps = {
    isRender: boolean;
    TreeViewSettings?: TTreeViewProps;
    children?: TTreeViewProps["children"];
};

function CustomTreeView({ isRender, TreeViewSettings = {}, children }: TCustomTreeViewProps) {
    return (
        <>
            <TreeView {...TreeViewSettings}>{isRender && children}</TreeView>
        </>
    );
}

const MemoTreeView = React.memo(CustomTreeView);

export { CustomTreeView, MemoTreeView };
