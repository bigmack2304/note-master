import React from "react";
import { Box } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { CodeBlock } from "react-code-blocks";
import { codeCustomThemeLight, codeCustomThemeDark } from "./NoteCodeValues";
import type { TCodeLanguages, TCodeThemes } from "./NoteCodeTypes";

type TNoteCodeProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    children?: string;
    language?: TCodeLanguages;
    codeTheme?: TCodeThemes;
};

// стили для контейнера
const codeWrapperStyle = (isChildren: boolean, themeMode: PaletteMode) => {
    return {
        "&.NoteCode": {
            overflow: "hidden",
            borderRadius: "5px",
            width: "100%",
        },

        "&.NoteCode--editable:hover": {
            outline: "1px red solid",
        },
    } as SxProps;
};

// стили для кода
const codeStyle = (isChildren: boolean) => {
    return {
        width: "100%",
        overflowX: "auto",
        fontFamily: "monospace",
        fontSize: "1rem",

        ...(isChildren
            ? {}
            : {
                  minHeight: "3rem",
              }),
    } as React.CSSProperties;
};

// определяет стили тему для кода
const calcCodeTheme = (codeTheme: TNoteCodeProps["codeTheme"], themeMode: PaletteMode) => {
    if (codeTheme === "auto") {
        if (themeMode === "dark") return codeCustomThemeDark;
        if (themeMode === "light") return codeCustomThemeLight;
    }
    if (codeTheme === "dark") return codeCustomThemeDark;
    if (codeTheme === "light") return codeCustomThemeLight;
    return codeCustomThemeLight;
};

/**
 * Компонент описывает код c подцветкой синтаксиса внутри заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClick - вызывается при клике на текст
 * @prop children - компонент можно использовать как обертка для других компонентов.
 * @prop onContextMenu - вызывается при клике правой кнопкой мыши по тексту
 * @prop language - название языка программирования
 * @prop codeTheme - выбор темы подцветки синтаксиса
 */
function NoteCode({ addClassNames = [], onClick, children = "", onContextMenu, language = "text", codeTheme = "auto" }: TNoteCodeProps) {
    const defaultClassName = "NoteCode";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(children);

    // если children пуст, то добавляем в Box класс text_empty
    if (!isChildren) {
        let tempClassName = genClassName.split(" ");
        tempClassName.push("text_empty");
        genClassName = tempClassName.join(" ");
    }

    return (
        <Box className={genClassName} sx={codeWrapperStyle(isChildren, themeMode)} onContextMenu={onContextMenu} onClick={onClick}>
            <CodeBlock
                text={children}
                language={language}
                showLineNumbers={true}
                theme={calcCodeTheme(codeTheme, themeMode)}
                customStyle={codeStyle(isChildren) as Record<string, string>}
            />
        </Box>
    );
}

export { NoteCode };
