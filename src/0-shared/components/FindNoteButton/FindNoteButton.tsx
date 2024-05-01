import React from "react";
import IconButton from "@mui/material/IconButton";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import "./FindNoteButton.scss";

type TFindNoteButtonProps = {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
    isActive?: boolean;
    disabled?: boolean;
};

/**
 * кнопка поиска заметки
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop size - размер иконки
 * @prop title - текст описания при наведении
 * @prop isActive - если true то иконка будет выделена цветом
 * @prop disabled
 */
function FindNoteButton({ onClick = () => {}, addClassNames = [], title, size = "inherit", isActive = false, disabled = false }: TFindNoteButtonProps) {
    const defaultClassName = "FindNoteButton";
    let genClassName = "";

    const calcClassName = () => {
        let tempClassname = defaultClassName.split(" ").concat(addClassNames);

        if (isActive) {
            tempClassname.push("FindNoteButton--active");
        }

        genClassName = tempClassname.join(" ");
    };

    calcClassName();

    return (
        <IconButton className={genClassName} aria-label={``} onClick={onClick} title={title} disabled={disabled}>
            <ContentPasteSearchIcon fontSize={size} />
        </IconButton>
    );
}

export { FindNoteButton };
