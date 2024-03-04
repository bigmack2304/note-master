import React from "react";
import { Box } from "@mui/material";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import Collapse from "@mui/material/Collapse";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { FsControlsButton } from "2-features/components/FsControlsButton/FsControlsButton";
import { NewTagButton } from "2-features/components/NewTagButton/NewTagButton";
import { NoteEditButton } from "2-features/components/EditButton/EditButton";
import { CloseAllFoldersTreeViewButton } from "2-features/components/CloseAllFoldersTreeViewButton/CloseAllFoldersTreeViewButton";
import { HideFsButton } from "2-features/components/HideFsButton/HideFsButton";
import "./style.scss";
import * as styles from "./ToolBarStyle";

type TToolBarprops = {
    addClassNames?: string[];
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
    const isFsControls = useAppSelector((state) => state.settingsData.fsTools);

    return (
        <Collapse in={isActive} className={"ToolBar_wrapper"} orientation="vertical">
            <Box className={genClassName} sx={styles.toolbarStyle(themeValue)}>
                <Collapse in={isFsControls} orientation="horizontal" className="ToolBar__fs_constiols_wrapper" unmountOnExit>
                    <Box className={"ToolBar__fs_constiols"}>
                        <CloseAllFoldersTreeViewButton />
                    </Box>
                </Collapse>
                <Box className={"ToolBar__main_constiols"}>
                    <FsControlsButton />
                    <HideFsButton />
                    <NoteEditButton />
                    <NewTagButton />
                </Box>
            </Box>
        </Collapse>
    );
}

export { ToolBar };
