import React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import { svgThemeColor } from "2-features/utils/themeStylesOverride";
import { useTemeMode } from "0-shared/hooks/useThemeMode";

type TTableIconProps = {
    svgIconSettings?: SvgIconProps;
    addClassNames?: string[];
};

/**
 * кастомная иконка таблицы
 * @prop svgIconSettings пропсы применяемые для Mui-SvgIcon
 */
function TableIcon({ svgIconSettings = {}, addClassNames = [] }: TTableIconProps) {
    const defaultClassName = "TableIcon";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();

    return (
        <SvgIcon {...svgIconSettings} className={genClassName} sx={{ fill: svgThemeColor(themeValue) }}>
            <svg viewBox="0 0 2120 2120" xmlns="http://www.w3.org/2000/svg">
                <g />
                <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="7.68" />
                <g>
                    <path
                        d="M1800 1320v420c0 33-27 60-60 60h-420v-480h480Zm-600 0v480H720v-480h480Zm-600 0v480H180c-33 0-60-27-60-60v-420h480Zm1200-600v480h-480V720h480Zm-600 0v480H720V720h480Zm-600 0v480H120V720h480Zm1140-600c33 0 60 27 60 60v420h-480V120h420Zm-540 0v480H720V120h480Zm-600 0v480H120V180c0-33 27-60 60-60h420ZM1740 0H180C80.76 0 0 80.76 0 180v1560c0 99.24 80.76 180 180 180h1560c99.24 0 180-80.76 180-180V180c0-99.24-80.76-180-180-180Z"
                        fillRule="evenodd"
                    />
                </g>
            </svg>
        </SvgIcon>
    );
}

export { TableIcon };
