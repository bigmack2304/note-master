import React from "react";
import { Box } from "@mui/material";
import type { SxProps } from "@mui/material";

type TWorkSpaceProps = {
    children: React.ReactNode;
    addClassNames?: string[];
};

const workSpaceStyle: SxProps = {
    position: "relative",
};

/**
 * Компонент рабочего пространства
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop children - компонент можно использовать как обертка для других компонентов.
 * @returns
 */
function WorkSpace({ children, addClassNames = [] }: TWorkSpaceProps) {
    const defaultClassName = "WorkSpace";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <Box className={genClassName} component={"div"} sx={workSpaceStyle}>
            {children}
        </Box>
    );
}

export { WorkSpace };
