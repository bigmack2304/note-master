import React from "react";
import { Box } from "@mui/material";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import Collapse from "@mui/material/Collapse";
import type { RootState } from "5-app/GlobalState/store";
import type { SxProps } from "@mui/material";

type TToolBarprops = {
    addClassNames?: string[];
};

const toolbarStyle: SxProps = {
    height: "30px",
    backgroundColor: "red",
};

/**
 * панель инструментов
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @returns
 */
function ToolBar({ addClassNames = [] }: TToolBarprops) {
    const defaultClassName = "ToolBar";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const isActive = useAppSelector((state) => state.toolBar.isActive);

    return (
        <Collapse in={isActive} className={"ToolBar_wrapper"} orientation="vertical">
            <Box className={genClassName} sx={toolbarStyle}></Box>
        </Collapse>
    );
}

export { ToolBar };
