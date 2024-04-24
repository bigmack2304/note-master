import React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import { svgThemeColor } from "2-features/utils/themeStylesOverride";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { SvgIconProps } from "@mui/material/SvgIcon";

type THeaderIconProps = {
    svgIconSettings?: SvgIconProps;
    addClassNames?: string[];
};

/**
 * кастомная иконка заголовка
 * @prop svgIconSettings пропсы применяемые для Mui-SvgIcon
 */
function HeaderIcon({ svgIconSettings = {}, addClassNames = [] }: THeaderIconProps) {
    const defaultClassName = "HeaderIcon";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();

    return (
        <SvgIcon {...svgIconSettings} className={genClassName} sx={{ fill: svgThemeColor(themeValue) }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 528 528">
                <path d="M16,496H496V16H16ZM48,48H464V464H48Z" />
                <polygon points="288 144 320 144 320 240 192 240 192 144 224 144 224 112 96 112 96 144 128 144 128 368 96 368 96 400 224 400 224 368 192 368 192 272 320 272 320 368 288 368 288 400 416 400 416 368 384 368 384 144 416 144 416 112 288 112 288 144" />
            </svg>
        </SvgIcon>
    );
}

export { HeaderIcon };
