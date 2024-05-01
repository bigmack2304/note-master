import React from "react";
import { AppBar as MuiAppBar, Toolbar } from "@mui/material";
import "./AppBar.scss";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { AppBarTypeMap } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { SxProps } from "@mui/material";

type TAppBarProps = {
    children?: React.ReactNode;
    addClassNames?: string[];
    AppBarSettings?: GetProps<OverridableComponent<AppBarTypeMap<{}, "header">>>;
};

const MuiAppBarStyle: SxProps = {};

/**
 * блок описывает хедер страницы, не имеет своего содержимого
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop children - компонент можно использовать как обертка для других компонентов.
 * @prop AppBarSettings - пропсы для настройки внутреннего компонента m.ui - AppBar
 */
function AppBar({ addClassNames = [], children, AppBarSettings = {} }: TAppBarProps) {
    const defaultClassName = "AppBar";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <MuiAppBar className={genClassName} {...AppBarSettings} sx={MuiAppBarStyle} color="info" enableColorOnDark>
            <Toolbar>{children}</Toolbar>
        </MuiAppBar>
    );
}

export { AppBar };
