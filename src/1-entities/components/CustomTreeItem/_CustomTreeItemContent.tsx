import React, { useRef, useImperativeHandle, useState, useEffect } from "react";
import { useTreeItem } from "@mui/x-tree-view";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import clsx from "clsx";
import { BORDER_LIGHT, BORDER_DARK, NOTE_STATUS_COMPLETE, NOTE_STATUS_NO_COMPLETE } from "5-app/settings";
import { Typography, Box } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import type { TreeItemContentProps } from "@mui/x-tree-view";
import type { SxProps, PaletteMode } from "@mui/material";
import type { TCuspomProps } from "./_CustomTreeItemTypes";
import type { TNodeType } from "0-shared/types/dataSave";

const CustomTreeItemContentStyle = (theme: PaletteMode) => {
    return {
        "&.CustomTreeItemContent": {
            cursor: "context-menu",
        },
        "&.CustomTreeItemContent > .MuiTreeItem-iconContainer": {
            marginRight: "0",
            width: "initial",
            cursor: "pointer",
        },
        "&.CustomTreeItemContent > .MuiTypography-root": {
            paddingLeft: "8px",
        },
        "&.CustomTreeItemContent + ul.MuiCollapse-root": {
            borderLeft: `1px ${theme === "light" ? BORDER_LIGHT : BORDER_DARK} dashed`,
        },

        "&.CustomTreeItemContent .CustomTreeItemContent__nodeName": {
            width: "100%",
            minWidth: "60px",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },

        "&.CustomTreeItemContent .CustomTreeItemContent__noteStatus--complete": {
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: NOTE_STATUS_COMPLETE,
            aspectRatio: "1/1",
            marginLeft: "5px",
        },

        "&.CustomTreeItemContent .CustomTreeItemContent__noteStatus--noComplete": {
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: NOTE_STATUS_NO_COMPLETE,
            aspectRatio: "1/1",
            marginLeft: "5px",
        },
    } as SxProps;
};

const IconFolderStyle = () => {
    return {
        cursor: "pointer",
    } as SxProps;
};

/**
 * описывает все содержимое каждого элемента фаиловой структуры заметок (значки, папки, названия)
 * @props обьект обьеденяет в себе типы TreeItemContentProps и TCuspomProps
 * @ подробнее о TCuspomProps смотреть типизацию
 */
const CustomTreeItemContent = React.forwardRef(function CustomTreeItem_Content(props: TreeItemContentProps & TCuspomProps, ref) {
    const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } = useTreeItem(props.nodeId);

    const icon = props.icon || props.expansionIcon || props.displayIcon;
    const defaultClassName = "CustomTreeItemContent";
    const MuiClassname = clsx(props.className, props.classes.root, {
        [props.classes.expanded]: expanded,
        [props.classes.selected]: selected,
        [props.classes.focused]: focused,
        [props.classes.disabled]: disabled,
    });
    const themeValue = useTemeMode();
    const nameRef = useRef<HTMLDivElement>(null);

    const genClassName = defaultClassName
        .concat(" ", MuiClassname)
        .split(" ")
        .concat(props.addClassNames ?? [])
        .join(" ");

    const NodeNameClass = "CustomTreeItemContent__nodeName".concat(" ", props.classes.label);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        preventSelection(event);
    };

    const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        handleExpansion(event);
    };

    const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        handleSelection(event);
    };

    const handleIconClick = (type: TNodeType | undefined, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (type && type == "note") {
            handleSelectionClick(event);
            return;
        }
        if (type && type == "folder") {
            handleExpansionClick(event);
            return;
        }
    };

    // вызывается только когда этот элемент получает статус selected
    // почему тут а не в handleSelectionClick? handleSelectionClick вызывается при клике, но selected может появится и если мы выберем элемент клавой, поэтому пока так
    useEffect(() => {
        if (selected) {
            props.onSelectCallback && props.onSelectCallback();
        }
    }, [selected]);

    return (
        <Box className={genClassName} sx={CustomTreeItemContentStyle(themeValue)} onMouseDown={handleMouseDown} ref={ref}>
            <Box onClick={handleExpansionClick} component={"div"} className={props.classes.iconContainer}>
                {icon}
            </Box>
            <Box onClick={handleIconClick.bind(null, props.nodeType)} sx={{ lineHeight: "0" }}>
                {props.nodeType && props.nodeType === "folder" ? <FolderIcon fontSize="small" sx={IconFolderStyle()} /> : <ContentPasteIcon fontSize="small" />}
            </Box>
            <Typography className={NodeNameClass} onClick={handleSelectionClick} component="span" ref={nameRef}>
                {props.label}
            </Typography>
            {props.noteComplete === "complete" ? (
                <Box className="CustomTreeItemContent__noteStatus--complete"></Box>
            ) : props.noteComplete === "noComlete" ? (
                <Box className="CustomTreeItemContent__noteStatus--noComplete"></Box>
            ) : null}
        </Box>
    );
});

export { CustomTreeItemContent };
