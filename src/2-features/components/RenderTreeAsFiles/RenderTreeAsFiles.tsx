import React from "react";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { nodeWithoutChildren } from "2-features/utils/saveDataUtils";
import type { TchildrenType } from "0-shared/types/dataSave";
import { isDataTreeFolder } from "0-shared/utils/typeHelpers";

type TRenderTreeAsFileProps = {
    node: TchildrenType | undefined;
    onClickNodeCallback?: (nodeData: TchildrenType, e: React.MouseEvent) => void;
    onNodeContextCallback?: (nodeData: TchildrenType, e: React.MouseEvent) => void;
};

/**
 * рендерит дерево node в виде фаилов и папок
 * @prop node - обьект типа IDataTreeFolder | IDataTreeNote
 * @prop onClickNodeCallback(nodeData, event) - колбек сработает при клике на отрендеренную node, nodeData - обьект типа IDataTreeFolder | IDataTreeNote без своиства children
 * @prop onNodeContextCallback(nodeData, event) - колбек сработает при попытке вызвать контекстное меню на ноде.
 * @returns
 */

function RenderTreeAsFile({ node, onClickNodeCallback, onNodeContextCallback }: TRenderTreeAsFileProps) {
    if (!node) return <></>;

    const nodeData = nodeWithoutChildren(node);

    const onClick = (e: React.MouseEvent) => {
        onClickNodeCallback && onClickNodeCallback(nodeData, e);
    };

    const onContextMenu = (e: React.MouseEvent) => {
        onNodeContextCallback && onNodeContextCallback(nodeData, e);
    };

    return (
        <TreeItem key={node.id} nodeId={node.id} label={node.name} onClick={onClick} onContextMenu={onContextMenu}>
            {isDataTreeFolder(node) && node.children && node.children.map((node) => RenderTreeAsFile({ node, onClickNodeCallback, onNodeContextCallback }))}
        </TreeItem>
    );
}

export { RenderTreeAsFile };
