import React from "react";
import "./BasePage.scss";
import { AppBar } from "0-shared";
import { ToggleMenuButton } from "2-features";
import { HeaderBar } from "3-widgets";

type Tprops = {
    addClassNames?: string[];
};

function BasePage({ addClassNames = [] }: Tprops) {
    const defaultClassName = "BasePage";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <div className={genClassName}>
            <HeaderBar></HeaderBar>
        </div>
    );
}

export { BasePage };
