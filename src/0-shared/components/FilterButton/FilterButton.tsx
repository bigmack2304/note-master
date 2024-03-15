import React from "react";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./FilterButton.scss";

type TFilterButtonProps = {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
    isActive?: boolean;
    disabled?: boolean;
};

/**
 * кнопка filter, (для таблиц)
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop size - размер иконки
 * @prop title - текст описания при наведении
 * @prop isActive - если false то иконка будет полупрозрачной
 * @prop disabled
 */
function FilterButton({ onClick = () => {}, addClassNames = [], title, size = "inherit", isActive = false, disabled = false }: TFilterButtonProps) {
    const defaultClassName = "FilterButton";
    let genClassName = "";

    const calcClassName = () => {
        let tempClassname = defaultClassName.split(" ").concat(addClassNames);

        if (isActive) {
            tempClassname.push("FilterButton--active");
        }

        genClassName = tempClassname.join(" ");
    };

    calcClassName();

    return (
        <IconButton className={genClassName} aria-label={``} onClick={onClick} title={title} disabled={disabled}>
            <FilterListIcon fontSize={size} />
        </IconButton>
    );
}

export { FilterButton };
