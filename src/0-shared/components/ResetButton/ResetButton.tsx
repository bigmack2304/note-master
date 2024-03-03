import React from "react";
import IconButton from "@mui/material/IconButton";
import type { SxProps } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

type TResetButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    buttonSettings?: ButtonProps;
    isStopPropagation?: boolean;
    sx?: SxProps;
    title?: string;
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * круглая кнопка "сбросить"
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop buttonSettings - настройки для m.ui button
 * @prop title - всплывающее описание
 * @prop isStopPropagation - если true то при клике, всплытие события будет остановлено
 */
function ResetButton({ onClick = () => {}, addClassNames = [], buttonSettings = {}, sx: addSx = {}, title, isStopPropagation = false }: TResetButtonProps) {
    const defaultClassName = "ResetButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    const onButtonClick = (e: React.MouseEvent) => {
        if (isStopPropagation) e.stopPropagation();
        onClick && onClick(e);
    };

    return (
        <IconButton
            {...buttonSettings}
            className={genClassName}
            aria-label="закрыть"
            size="large"
            sx={{ ...ButtonStyle, ...addSx } as SxProps}
            onClick={onButtonClick}
            title={title}
        >
            <RestartAltIcon fontSize="large" />
        </IconButton>
    );
}

export { ResetButton };
