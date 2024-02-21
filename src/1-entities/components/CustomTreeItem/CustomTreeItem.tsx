import React from "react";
import { TreeItem } from "@mui/x-tree-view";
import { styled } from "@mui/material/styles";
import { CustomTreeItemContent } from "./_CustomTreeItemContent";
import type { TCustomTreeItemContentProps } from "./_CustomTreeItemTypes";
import type { TreeItemContentProps } from "@mui/x-tree-view";

// какойто базовый элемент
const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({})) as unknown as typeof TreeItem;

/**
 * компонент для отображения элементов фаиловой системы заметок
 * @prop props пропсы типа TreeItemProps, используются для родительского элемента material ui
 * @prop customProps пропсы типа TCuspomProps передаются в кастомный компонент описывающий визуализацию элемента
 * @customProp NodeType тип элемента TNodeType (для вывода ярлыка папки или заметки)
 * @customProp addClassNames массив строк, которые будут добавлены каждому элементу как классы
 * @customProp onSelectCallback колбек вызывается при выборе какого либо элемента списка
 */
const CustomTreeItem = React.forwardRef(function CustomTreeItem(props: TCustomTreeItemContentProps, ref: React.Ref<HTMLLIElement>) {
    return (
        <StyledTreeItemRoot
            {...props.props}
            ref={ref}
            ContentComponent={CustomTreeItemContent as React.ForwardRefExoticComponent<TreeItemContentProps & React.RefAttributes<unknown>>}
            ContentProps={{ ...props.customProps } as React.HTMLAttributes<HTMLElement>}
        >
            {props.children}
        </StyledTreeItemRoot>
    );
});

export { CustomTreeItem };
