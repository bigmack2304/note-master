import React from "react";
import "./BasePage.scss";
import { AppBar } from "0-shared";
import { ToggleMenuButton } from "2-features";

type Tprops = {
    addClassNames?: string[];
};

function BasePage({ addClassNames = [] }: Tprops) {
    const defaultClassName = "BasePage";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <div className={genClassName}>
            <AppBar>
                <ToggleMenuButton></ToggleMenuButton>
            </AppBar>
        </div>
    );
}

export { BasePage };
