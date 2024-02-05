import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import type { SxProps } from "@mui/material";

type TCloseButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * круглая кнопка с крестиком
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function CloseButton({ onClick = () => {}, addClassNames = [] }: TCloseButtonProps) {
    const defaultClassName = "CloseButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <IconButton className={genClassName} aria-label="закрыть" size="large" sx={ButtonStyle} onClick={onClick}>
            <CloseIcon fontSize="large" />
        </IconButton>
    );
}

export { CloseButton };
