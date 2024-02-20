import React from "react";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import type { SxProps } from "@mui/material";
import type { ButtonProps } from "@mui/material";

type TOkButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
    type?: HTMLButtonElement["type"];
    sx?: SxProps;
    buttonSettings?: ButtonProps;
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * круглая кнопка с галочкой
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop size - размер m.ui
 * @prop title - всплывающая подсказка
 * @prop type - тип для формы
 * @prop buttonSettings - остальные настройки кнопки m.ui
 */
function OkButton({ onClick = () => {}, addClassNames = [], title, size = "large", type, buttonSettings = {}, sx: addSx = {} }: TOkButtonProps) {
    const defaultClassName = "OkButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <IconButton
            {...buttonSettings}
            className={genClassName}
            type={type}
            aria-label="подтвердить"
            size="large"
            sx={{ ...ButtonStyle, ...addSx } as SxProps}
            onClick={onClick}
            title={title}
        >
            <DoneIcon fontSize={size} />
        </IconButton>
    );
}

export { OkButton };
