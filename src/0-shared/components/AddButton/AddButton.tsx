import React from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import type { SxProps } from "@mui/material";

type TAddButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * круглая кнопка с галочкой
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function AddButton({ onClick = () => {}, addClassNames = [] }: TAddButtonProps) {
    const defaultClassName = "AddButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <IconButton className={genClassName} aria-label="добавить элемент" size="large" sx={ButtonStyle} onClick={onClick}>
            <AddCircleIcon fontSize="large" color="primary" />
        </IconButton>
    );
}

export { AddButton };
