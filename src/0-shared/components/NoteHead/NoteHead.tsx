import React from "react";
import Typography from "@mui/material/Typography";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { PaletteMode, SxProps } from "@mui/material";
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
        whiteSpace: "normal",
        overflow: "hidden",
        textOverflow: "ellipsis",

        "&.NoteHead.text_empty": {
            display: "flex",
            justifyContent: "center",
            minHeight: "3rem",
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
            borderRadius: "3px",
        },

        "&.NoteHead--editable:hover": {
            outline: "1px red solid",
        },

        "&.NoteHead--aliginLeft": {
            textAlign: "left",
        },
        "&.NoteHead--aliginCenter": {
            textAlign: "center",
        },
        "&.NoteHead--aliginRight": {
            textAlign: "right",
        },

        "&.NoteHead.text_empty:before": {
            fontSize: "1rem",
            content: "'Заголовок'",
            opacity: "50%",
        },
    } as SxProps;
};

const typographyVariant = (addClassNames: string[]): GetProps<typeof Typography>["variant"] => {
    if (addClassNames.includes("NoteHead--sizeH2")) {
        return "h2";
    }
    if (addClassNames.includes("NoteHead--sizeH3")) {
        return "h3";
    }
    if (addClassNames.includes("NoteHead--sizeH4")) {
        return "h4";
    }
    if (addClassNames.includes("NoteHead--sizeH5")) {
        return "h5";
    }
    if (addClassNames.includes("NoteHead--sizeH6")) {
        return "h6";
    }
    return "h3";
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
        <Typography
            {...typographySettings}
            className={genClassName}
            variant={typographyVariant(addClassNames)}
            onContextMenu={onContextMenu}
            onClick={onClick}
            sx={typographyStyle(isChildren, themeMode)}
        >
            {children}
        </Typography>
    );
}

export { NoteHead };
