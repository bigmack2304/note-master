import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import type { SxProps } from "@mui/material";

type TDeleteButtonProps = {
    onClick?: (e: React.MouseEvent, customData: any) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
    customData?: any;
    disabled?: boolean;
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * круглая кнопка с со значком удалить
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop size - размер
 * @prop title - всплывающее описание
 * @prop customData - какието данные кеоторые будут возвращены в вызове onClick
 * @prop disabled - неактивная кнопка
 */
function DeleteButton({ onClick, addClassNames = [], title, size = "inherit", customData, disabled = false }: TDeleteButtonProps) {
    const defaultClassName = "DeleteButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    const clickCallback = (e: React.MouseEvent) => {
        onClick && onClick(e, customData);
    };

    return (
        <IconButton
            className={genClassName}
            aria-label="закрыть"
            sx={ButtonStyle}
            onClick={clickCallback}
            title={title}
            disabled={disabled}
        >
            <DeleteIcon fontSize={size} />
        </IconButton>
    );
}

export { DeleteButton };
