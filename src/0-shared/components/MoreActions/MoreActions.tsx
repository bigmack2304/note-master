import React, { useRef, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { SxProps } from "@mui/material";

// добавляет кнопку рядом с компонентом

interface IMoreActionsProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const rootStyle: SxProps = {
    display: "contents",
};

const calcButtonStyle: SxProps = {
    position: "absolute",
    transform: "translate(50%, -50%)",
};

function MoreActions({ children, onClick }: IMoreActionsProps) {
    const rootElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!rootElement.current || !rootElement.current.children[0]) return;
        const firstChildren = rootElement.current.children[0];
        const button = rootElement.current.children[1] as HTMLButtonElement;
        let pos = firstChildren.getBoundingClientRect();
        Object.assign(button.style, { top: `${pos.top}px`, left: `${pos.right}px` });
    });

    return (
        <Box component={"div"} sx={rootStyle} ref={rootElement}>
            {children}
            <IconButton sx={calcButtonStyle} onClick={onClick} aria-label="Опции">
                <MoreHorizIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}

export { MoreActions };
