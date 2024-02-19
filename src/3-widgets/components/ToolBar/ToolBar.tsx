import React from "react";
import { Box } from "@mui/material";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import Collapse from "@mui/material/Collapse";
import type { RootState } from "5-app/GlobalState/store";
import type { SxProps } from "@mui/material";
import { TOOLBAR_BG_DARK_COLOR, TOOLBAR_BG_LIGHT_COLOR, TOOLBAR_BORDER_DARK_COLOR, TOOLBAR_BORDER_LIGHT_COLOR } from "5-app/settings";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { PaletteMode } from "@mui/material";
import { NewTagButton } from "2-features/components/NewTagButton/NewTagButton";
import { NoteEditButton } from "2-features/components/EditButton/EditButton";

type TToolBarprops = {
    addClassNames?: string[];
};

const toolbarStyle = (theme: PaletteMode) => {
    let style: React.CSSProperties = {};

    if (theme === "light") {
        style.backgroundColor = TOOLBAR_BG_LIGHT_COLOR;
        style.borderBottom = `1px ${TOOLBAR_BORDER_LIGHT_COLOR} solid`;
    } else {
        style.backgroundColor = TOOLBAR_BG_DARK_COLOR;
        style.borderBottom = `1px ${TOOLBAR_BORDER_DARK_COLOR} solid`;
    }

    style.height = "40px";
    style.overflow = "hidden";
    style.display = "flex";
    style.flexDirection = "row";
    style.flexWrap = "wrap";
    style.alignContent = "center";
    style.justifyContent = "center";
    style.alignItems = "center";
    style.gap = "5px";

    return style as SxProps;
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
            <Box className={genClassName} sx={toolbarStyle(themeValue)}>
                <NoteEditButton></NoteEditButton>
                <NewTagButton></NewTagButton>
            </Box>
        </Collapse>
    );
}

export { ToolBar };
