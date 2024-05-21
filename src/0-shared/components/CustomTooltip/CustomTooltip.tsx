import React from "react";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import "./CustomTooltip.scss";
import * as style from "./CustomTooltipStyle";
import type { TooltipProps } from "@mui/material/Tooltip";

/**
 * Всплывающее описание
 */
function CustomTooltip({ className, ...props }: TooltipProps) {
    const themeValue = useTemeMode();
    const componentClassName = "CustomToolTip";
    return (
        <Tooltip
            placement="bottom-start"
            className={componentClassName}
            classes={{ popper: `${className ? className : ""} ${componentClassName}` }}
            componentsProps={{ popper: { sx: style.customToolTipStyle(themeValue) } }}
            enterDelay={800}
            enterNextDelay={800}
            {...props}
        />
    );
}

export { CustomTooltip };
