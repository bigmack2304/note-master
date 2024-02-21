import type { TreeItemProps } from "@mui/x-tree-view";
import type { TNodeType } from "0-shared/types/dataSave";

type TCuspomProps = {
    nodeType?: TNodeType;
    noteComplete?: "complete" | "noComlete";
    addClassNames?: string[];
    //onSelectCallback?: (e: React.MouseEvent) => void;
    onSelectCallback?: () => void;
};

type TCustomTreeItemContentProps = {
    props: TreeItemProps;

    customProps: TCuspomProps;

    children: React.ReactNode;
};

export type { TCuspomProps, TCustomTreeItemContentProps };
