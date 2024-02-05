import React from "react";
import Typography from "@mui/material/Typography";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { SxProps } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";

type TNoteHeadProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    children?: React.ReactNode;
    typographySettings?: GetProps<typeof Typography>;
};

const typographyStyle = (isChildren: boolean, themeMode: PaletteMode) => {
    return {
        display: "inline-block",

        ...(isChildren
            ? {}
            : {
                  minHeight: "3rem",
                  width: "clamp(10px, 300px, 100%)",
                  backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
                  borderRadius: "3px",
              }),
    } as SxProps;
};

/**
 * Компонент описывает заголовок внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop children - компонент можно использовать как обертка для других компонентов.
 * @prop typographySettings - пропсы для настройки внутреннего компонента m.ui - Typography
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 */
function NoteHead({ addClassNames = [], onClick, children, typographySettings, onContextMenu }: TNoteHeadProps) {
    const defaultClassName = "NoteHead";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(children);

    return (
        <Typography className={genClassName} variant="h4" onContextMenu={onContextMenu} onClick={onClick} sx={typographyStyle(isChildren, themeMode)} {...typographySettings}>
            {children}
        </Typography>
    );
}

export { NoteHead };
