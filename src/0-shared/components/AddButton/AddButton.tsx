import React from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import type { SxProps } from "@mui/material";

type TAddButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * круглая кнопка с плюсиком
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function AddButton({ onClick = () => {}, addClassNames = [], title, size = "large" }: TAddButtonProps) {
    const defaultClassName = "AddButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <IconButton className={genClassName} aria-label="добавить элемент" sx={ButtonStyle} onClick={onClick} title={title}>
            <AddCircleIcon fontSize={size} color="primary" />
        </IconButton>
    );
}

const AddButton_memp = React.memo(AddButton);

export { AddButton, AddButton_memp };
