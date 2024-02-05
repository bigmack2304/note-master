import React from "react";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { nodeWithoutChildren } from "2-features/utils/saveDataUtils";
import type { TchildrenType } from "0-shared/types/dataSave";
import { isDataTreeFolder } from "0-shared/utils/typeHelpers";

type TRenderTreeAsFileProps = {
    node: TchildrenType;
    onClickNodeCallback?: (nodeData: TchildrenType) => void;
};

/**
 * рендерит дерево node в виде фаилов и папок
 * @prop node - обьект типа IDataTreeFolder | IDataTreeNote
 * @prop onClickNodeCallback(nodeData) - колбек сработает при клике на отрендеренную node, nodeData - обьект типа IDataTreeFolder | IDataTreeNote без своиства children
 * @returns
 */
function RenderTreeAsFile({ node, onClickNodeCallback }: TRenderTreeAsFileProps) {
    const nodeData = nodeWithoutChildren(node);

    const onClick = () => {
        onClickNodeCallback && onClickNodeCallback(nodeData);
    };

    return (
        <TreeItem key={node.id} nodeId={node.id} label={node.name} onClick={onClick}>
            {isDataTreeFolder(node) && node.children && node.children.map((node) => RenderTreeAsFile({ node, onClickNodeCallback }))}
        </TreeItem>
    );
}

export { RenderTreeAsFile };
