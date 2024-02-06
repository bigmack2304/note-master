import React from "react";
import "./BasePage.scss";
import { HeaderBar } from "3-widgets/components/HeaderBar/HeaderBar";
import { WorkSpace } from "0-shared/components/WorkSpace/WorkSpace";
import { Note } from "3-widgets/components/Note/Note";
import { FolderTreeViewer } from "3-widgets/components/FolderTreeViewer/FolderTreeViewer";
import { ToolBar } from "3-widgets/components/ToolBar/ToolBar";

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

    return (
        <div className={genClassName}>
            <HeaderBar></HeaderBar>
            <ToolBar addClassNames={["BasePage__toolbar"]}></ToolBar>
            <div className="BasePage__workSpace_wrapper">
                <FolderTreeViewer />
                <WorkSpace addClassNames={["BasePage__workSpace"]}>
                    <Note></Note>
                </WorkSpace>
            </div>
        </div>
    );
}

export { BasePage };
