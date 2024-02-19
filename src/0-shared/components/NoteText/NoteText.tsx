import React from "react";
import { Typography, Box } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { SxProps } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";

type TNoteTextProps = {
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
                  backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
                  borderRadius: "5px",
              }),

        "&.NoteText--bg-light": {
            backgroundColor: THEME_LIGHT_GRAY,
            padding: "5px",
            borderRadius: "5px",
        },
        "&.NoteText--bg-dark": {
            backgroundColor: THEME_DARK_GRAY,
            padding: "5px",
            borderRadius: "5px",
        },
        "&.NoteText--noFormat": {
            whiteSpace: "break-spaces",
        },
        "&.NoteText--font-code": {
            fontFamily: "monospace",
        },
        "&.NoteText--overflowXScroll": {
            whiteSpace: "pre",
        },
        "&.NoteText--editable:hover": {
            outline: "1px red solid",
        },
    } as SxProps;
};

const noteTextWrapperStyle = (isChildren: boolean, themeMode: PaletteMode) => {
    return {
        overflow: "hidden",
        lineHeight: "0px",

        "&:has(> .NoteText[class*='NoteText--bg'])": {
            borderRadius: "5px",
        },

        "&:has(> .NoteText[class*='text_empty'])": {
            borderRadius: "5px",
        },

        "&:has(> .NoteText--overflowXScroll)": {
            overflowX: "auto",
        },

        "&:has(> .NoteText[class*='NoteText--editable']):hover": {
            outline: "1px red solid",
        },
    } as SxProps;
};

/**
 * Компонент описывает текст внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop children - компонент можно использовать как обертка для других компонентов.
 * @prop typographySettings - пропсы для настройки внутреннего компонента m.ui - Typography
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 */
function NoteText({ addClassNames = [], onClick, children, typographySettings, onContextMenu }: TNoteTextProps) {
    const defaultClassName = "NoteText";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(children);

    // если children пуст, то добавляем в Typography класс text_empty
    if (!isChildren) {
        let tempClassName = genClassName.split(" ");
        tempClassName.push("text_empty");
        genClassName = tempClassName.join(" ");
    }

    return (
        <Box className={"NoteText_wrapper"} sx={noteTextWrapperStyle(isChildren, themeMode)}>
            <Typography
                {...typographySettings}
                className={genClassName}
                variant="body1"
                onContextMenu={onContextMenu}
                onClick={onClick}
                sx={typographyStyle(isChildren, themeMode)}
            >
                {children}
            </Typography>
        </Box>
    );
}

export { NoteText };
