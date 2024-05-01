import React from "react";
import IconButton from "@mui/material/IconButton";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import "./ColumnsButton.scss";

type TColumnsButtonProps = {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
    isActive?: boolean;
    disabled?: boolean;
};

/**
 * кнопка с тремя вертикальными колонками, (для таблиц)
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop size - размер иконки
 * @prop title - текст описания при наведении
 * @prop isActive - если false то иконка будет полупрозрачной
 * @prop disabled
 */
function ColumnsButton({ onClick = () => {}, addClassNames = [], title, size = "inherit", isActive = false, disabled = false }: TColumnsButtonProps) {
    const defaultClassName = "ColumnsButton";
    let genClassName = "";

    const calcClassName = () => {
        let tempClassname = defaultClassName.split(" ").concat(addClassNames);

        if (isActive) {
            tempClassname.push("ColumnsButton--active");
        }

        genClassName = tempClassname.join(" ");
    };

    calcClassName();

    return (
        <IconButton className={genClassName} aria-label={``} onClick={onClick} title={title} disabled={disabled}>
            <ViewWeekIcon fontSize={size} />
        </IconButton>
    );
}

export { ColumnsButton };
