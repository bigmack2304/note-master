import React from "react";
import IconButton from "@mui/material/IconButton";
import type { SxProps } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type TDeleteButtonProps = {
    onClick?: (e: React.MouseEvent, customData: any) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
    customData?: any;
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * круглая кнопка с со значком сохранить
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function DeleteButton({ onClick, addClassNames = [], title, size = "inherit", customData }: TDeleteButtonProps) {
    const defaultClassName = "DeleteButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    const clickCallback = (e: React.MouseEvent) => {
        onClick && onClick(e, customData);
    };

    return (
        <IconButton className={genClassName} aria-label="закрыть" sx={ButtonStyle} onClick={clickCallback} title={title}>
            <DeleteIcon fontSize={size} />
        </IconButton>
    );
}

export { DeleteButton };
