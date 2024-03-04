import React, { useState } from "react";
import { IconButton } from "@mui/material";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { toggleFsHide } from "5-app/GlobalState/noteStore";
import "./style.scss";

type THideFsButtonProps = {
    addClassNames?: string[];
};

/**
 * кнопка, скрывает панель навигации
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function HideFsButton({ addClassNames = [] }: THideFsButtonProps) {
    const defaultClassName = "HideFsButton";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const isChecked = useAppSelector((store) => store.noteEditData.isFsHide);
    const dispatch = useAppDispatch();

    if (isChecked) {
        genClassName = genClassName.concat(" ", "HideFsButton--checked");
    }

    const onButtonClick = () => {
        dispatch(toggleFsHide());
    };

    return (
        <>
            <IconButton
                className={genClassName}
                aria-label="Скрыть панель навигации"
                title={"Скрыть панель навигации"}
                size="small"
                onClick={onButtonClick}
                // sx={buttonStyle(isChecked)}
            >
                <ChromeReaderModeIcon fontSize="small" />
            </IconButton>
        </>
    );
}

export { HideFsButton };
