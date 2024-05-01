import React from "react";
import "./BasePage.scss";
import { HeaderBar } from "3-widgets/components/HeaderBar/HeaderBar";
import { WorkSpace } from "0-shared/components/WorkSpace/WorkSpace";
import { Note } from "3-widgets/components/Note/Note";
import { FolderTreeViewer } from "3-widgets/components/FolderTreeViewer/FolderTreeViewer";
import { ToolBar } from "3-widgets/components/ToolBar/ToolBar";
import { LoadingStatus } from "2-features/components/LoadingStatus/LoadingStatus";
import { Resizable } from "0-shared/hoc/Resizable/Resizable";
import { setTreeViewWidth } from "5-app/GlobalState/settingsStore";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";

type TBasePageprops = {
    addClassNames?: string[];
};

/**
 * базавая страница
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @returns
 */
function BasePage({ addClassNames = [] }: TBasePageprops) {
    const defaultClassName = "BasePage";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const treeViewWidth = useAppSelector((state) => state.settingsData.treeViewWidth);
    const isFsHide = useAppSelector((state) => state.noteEditData.isFsHide);
    const dispatch = useAppDispatch();

    const onFolderTreeViewerResize = (newWidth: number) => {
        dispatch(setTreeViewWidth(newWidth));
    };

    return (
        <>
            <LoadingStatus addClassNames={["BasePage_loader"]} />
            <div className={genClassName}>
                <HeaderBar></HeaderBar>
                <ToolBar addClassNames={["BasePage__toolbar"]}></ToolBar>
                <div className="BasePage__workSpace_wrapper">
                    <Resizable WrappedComponent={FolderTreeViewer} wrappedProps={{}} startSize={treeViewWidth} onResize={onFolderTreeViewerResize} optimizeMount close={isFsHide} />
                    <WorkSpace addClassNames={["BasePage__workSpace"]}>
                        <Note></Note>
                    </WorkSpace>
                </div>
            </div>
        </>
    );
}

export { BasePage };
