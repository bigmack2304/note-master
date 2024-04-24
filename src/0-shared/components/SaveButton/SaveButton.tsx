import React from "react";
import IconButton from "@mui/material/IconButton";
import type { SxProps } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

type TSaveButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    size?: "inherit" | "small" | "medium" | "large";
    title?: string;
    type?: HTMLButtonElement["type"];
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

/**
 * круглая кнопка с со значком сохранить
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function SaveButton({ onClick = () => {}, addClassNames = [], title, size = "inherit", type }: TSaveButtonProps) {
    const defaultClassName = "SaveButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <IconButton className={genClassName} aria-label="закрыть" sx={ButtonStyle} onClick={onClick} title={title} type={type}>
            <SaveIcon fontSize={size} />
        </IconButton>
    );
}

const SaveButton_memo = React.memo(SaveButton);
const SaveButton_memo_is_equal = React.memo(SaveButton);
export { SaveButton, SaveButton_memo, SaveButton_memo_is_equal };
