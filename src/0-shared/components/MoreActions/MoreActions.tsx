import React, { useRef, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useUpdateOnResize } from "0-shared/hooks/useUpdateOnResize";
import type { SxProps } from "@mui/material";

// добавляет кнопку рядом с компонентом

interface IMoreActionsProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

const rootStyle: SxProps = {
    display: "contents",
};

function calcButtonStyle(position: IMoreActionsProps["position"], toAttachRect: DOMRect) {
    let style: SxProps = {
        position: "absolute",
    };

    switch (position) {
        case "topLeft":
            Object.assign(style, {
                transform: "translate(-150%, -50%)",
                top: `${toAttachRect.top}px`,
                left: `${toAttachRect.left}px`,
            });
            break;
        case "topRight":
            Object.assign(style, {
                transform: "translate(50%, -50%)",
                top: `${toAttachRect.top}px`,
                left: `${toAttachRect.right}px`,
            });
            break;
        case "bottomLeft":
            Object.assign(style, {
                transform: "translate(-150%, -50%)",
                top: `${toAttachRect.bottom}px`,
                left: `${toAttachRect.left}px`,
            });
            break;
        case "bottomRight":
            Object.assign(style, {
                transform: "translate(50%, -50%)",
                top: `${toAttachRect.bottom}px`,
                left: `${toAttachRect.right}px`,
            });
            break;
        default:
            console.warn(`calcButtonStyle(position: ${position}) not processed!`);
            break;
    }

    return style;
}

function MoreActions({ children, onClick, position = "topRight" }: IMoreActionsProps) {
    const rootElement = useRef<HTMLDivElement>(null);
    useUpdateOnResize(true);

    useEffect(() => {
        if (!rootElement.current || !rootElement.current.children[0]) return;
        const firstChildren = rootElement.current.children[0];
        const button = rootElement.current.children[1] as HTMLButtonElement;
        let pos = firstChildren.getBoundingClientRect();
        Object.assign(button.style, calcButtonStyle(position, pos));
    });

    return (
        <Box component={"div"} sx={rootStyle} ref={rootElement}>
            {children}
            <IconButton onClick={onClick} aria-label="Опции">
                <MoreHorizIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}

export { MoreActions };
