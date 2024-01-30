import React from "react";
import "./BasePage.scss";
import { HeaderBar } from "3-widgets/components/HeaderBar/HeaderBar";
import { WorkSpace } from "0-shared/components/WorkSpace/WorkSpace";

type TBasePageprops = {
    addClassNames?: string[];
};

function BasePage({ addClassNames = [] }: TBasePageprops) {
    const defaultClassName = "BasePage";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <div className={genClassName}>
            <HeaderBar></HeaderBar>
            <WorkSpace></WorkSpace>
        </div>
    );
}

export { BasePage };
