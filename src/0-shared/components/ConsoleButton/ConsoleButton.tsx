import React from "react";
import IconButton from "@mui/material/IconButton";
import TerminalIcon from "@mui/icons-material/Terminal";
import "./ConsoleButton.scss";

type TConsoleButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
    type?: HTMLButtonElement["type"];
};
/**
 * круглая кнопка со значком консоли
 * @prop onClick - вызывается при клике на кнопку (имеет внутреннюю реализацию)
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function ConsoleButton({ onClick, addClassNames = [], title, size = "large", type }: TConsoleButtonProps) {
    const defaultClassName = "ConsoleButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    const handleClick = (e: React.MouseEvent) => {
        onClick && onClick(e);
    };

    return (
        <IconButton className={genClassName} aria-label="Открыть консоль" onClick={handleClick} title={title} type={type}>
            <TerminalIcon fontSize={size} />
        </IconButton>
    );
}

const ConsoleButton_memp = React.memo(ConsoleButton);

export { ConsoleButton, ConsoleButton_memp };
