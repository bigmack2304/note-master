import React from "react";
import "./BasePage.scss";
import { HeaderBar } from "3-widgets/components/HeaderBar/HeaderBar";
import { WorkSpace } from "0-shared/components/WorkSpace/WorkSpace";
import { Note } from "1-entities/components/Note/Note";
import { TreeViewer } from "3-widgets/components/TreeViewer/TreeViewer";

type TBasePageprops = {
    addClassNames?: string[];
};

function BasePage({ addClassNames = [] }: TBasePageprops) {
    const defaultClassName = "BasePage";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <div className={genClassName}>
            <HeaderBar></HeaderBar>
            <div className="BasePage__workSpace_wrapper">
                <TreeViewer></TreeViewer>
                <WorkSpace addClassNames={["BasePage__workSpace"]}>
                    <Note headerText="hello world"></Note>
                </WorkSpace>
            </div>
        </div>
    );
}

export { BasePage };
