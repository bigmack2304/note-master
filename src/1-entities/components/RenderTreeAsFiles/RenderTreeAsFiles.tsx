import React from "react";
import { nodeWithoutChildren } from "2-features/utils/saveDataUtils";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { CustomTreeItem } from "1-entities/components/CustomTreeItem/CustomTreeItem";
import type { TchildrenType } from "0-shared/types/dataSave";
import type { IFindNodeParametres } from "5-app/GlobalState/toolBarStore";

type TRenderTreeAsFileProps = {
    node: TchildrenType | undefined;
    onClickNodeCallback?: (nodeData: TchildrenType) => void;
    onNodeContextCallback?: (nodeData: TchildrenType, e: React.MouseEvent) => void;
    findParams?: IFindNodeParametres;
};

/**
 * рендерит дерево node в виде фаилов и папок
 * @prop node - обьект типа IDataTreeFolder | IDataTreeNote
 * @prop onClickNodeCallback(nodeData, event) - колбек сработает при клике на отрендеренную node, nodeData - обьект типа IDataTreeFolder | IDataTreeNote без своиства children
 * @prop onNodeContextCallback(nodeData, event) - колбек сработает при попытке вызвать контекстное меню на ноде.
 * @returns
 */

function RenderTreeAsFile({ node, onClickNodeCallback, onNodeContextCallback, findParams }: TRenderTreeAsFileProps) {
    if (!node) return <></>;

    const nodeData = nodeWithoutChildren(node);

    const onSelect = () => {
        onClickNodeCallback && onClickNodeCallback(nodeData);
    };

    const onContextMenu = (e: React.MouseEvent) => {
        onNodeContextCallback && onNodeContextCallback(nodeData, e);
    };

    let noteComplete: "complete" | "noComlete" | undefined;

    if (isDataTreeNote(node)) {
        noteComplete = node.completed ? "complete" : "noComlete";
    }

    return (
        <CustomTreeItem
            key={node.id}
            customProps={{ nodeType: node.type, noteComplete: noteComplete, onSelectCallback: onSelect }}
            props={{ nodeId: node.id, label: node.name, onContextMenu: onContextMenu }}
        >
            {isDataTreeFolder(node) &&
                node.children &&
                node.children.map((node) => {
                    return RenderTreeAsFile({ node, onClickNodeCallback, onNodeContextCallback });
                })}
        </CustomTreeItem>
    );
}

export { RenderTreeAsFile };
