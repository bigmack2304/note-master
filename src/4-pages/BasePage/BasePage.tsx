import React from "react";
import "./BasePage.scss";
import { HeaderBar } from "3-widgets/components/HeaderBar/HeaderBar";
import { WorkSpace } from "0-shared/components/WorkSpace/WorkSpace";
import { Note } from "1-entities/components/Note/Note";
import { TreeViewer } from "3-widgets/components/TreeViewer/TreeViewer";
import { ToolBar } from "3-widgets/components/ToolBar/ToolBar";

type TBasePageprops = {
    addClassNames?: string[];
};

function BasePage({ addClassNames = [] }: TBasePageprops) {
    const defaultClassName = "BasePage";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <div className={genClassName}>
            <HeaderBar></HeaderBar>
            <ToolBar addClassNames={["BasePage__toolbar"]}></ToolBar>
            <div className="BasePage__workSpace_wrapper">
                <TreeViewer></TreeViewer>
                <WorkSpace addClassNames={["BasePage__workSpace"]}>
                    <Note></Note>
                </WorkSpace>
            </div>
        </div>
    );
}

export { BasePage };
