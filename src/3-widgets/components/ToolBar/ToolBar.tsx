import React from "react";
import { Box } from "@mui/material";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import Collapse from "@mui/material/Collapse";
import type { RootState } from "5-app/GlobalState/store";
import type { SxProps } from "@mui/material";
import { TOOLBAR_BG_DARK_COLOR, TOOLBAR_BG_LIGHT_COLOR } from "5-app/settings";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { PaletteMode } from "@mui/material";

type TToolBarprops = {
    addClassNames?: string[];
};

const toolbarStyle = (theme: PaletteMode) => {
    return {
        height: "30px",
        backgroundColor: theme === "light" ? TOOLBAR_BG_LIGHT_COLOR : TOOLBAR_BG_DARK_COLOR,
    } as SxProps;
};

/**
 * панель инструментов
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @returns
 */
function ToolBar({ addClassNames = [] }: TToolBarprops) {
    const themeValue = useTemeMode();
    const defaultClassName = "ToolBar";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const isActive = useAppSelector((state) => state.toolBar.isActive);

    return (
        <Collapse in={isActive} className={"ToolBar_wrapper"} orientation="vertical">
            <Box className={genClassName} sx={toolbarStyle(themeValue)}></Box>
        </Collapse>
    );
}

export { ToolBar };
