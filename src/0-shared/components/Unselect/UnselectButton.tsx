import React from "react";
import IconButton from "@mui/material/IconButton";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import type { SxProps } from "@mui/material";
import type { ButtonProps } from "@mui/material";

type TUnselectButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    buttonSettings?: ButtonProps;
    isStopPropagation?: boolean;
    sx?: SxProps;
    title?: string;
    size?: "inherit" | "small" | "medium" | "large";
    disabled?: boolean;
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * кнопка для снятия всех флажков выбора
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop buttonSettings - настройки для m.ui button
 * @prop title - всплывающее описание
 * @prop isStopPropagation - если true то при клике, всплытие события будет остановлено
 * @prop size - размер кнопки
 * @prop disabled
 */
function UnselectButton({
    onClick = () => {},
    addClassNames = [],
    buttonSettings = {},
    sx: addSx = {},
    title,
    isStopPropagation = false,
    size = "inherit",
    disabled = false,
}: TUnselectButtonProps) {
    const defaultClassName = "UnselectButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    const onButtonClick = (e: React.MouseEvent) => {
        if (isStopPropagation) e.stopPropagation();
        onClick && onClick(e);
    };

    return (
        <IconButton
            className={genClassName}
            aria-label="закрыть"
            sx={{ ...ButtonStyle, ...addSx } as SxProps}
            onClick={onButtonClick}
            title={title}
            disabled={disabled}
            {...buttonSettings}
        >
            <IndeterminateCheckBoxIcon fontSize={size} />
        </IconButton>
    );
}

export { UnselectButton };
