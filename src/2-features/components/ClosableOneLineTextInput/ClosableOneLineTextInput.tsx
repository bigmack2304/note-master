import React, { useState } from "react";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import { CloseButton } from "0-shared/components/CloseButton/CloseButton";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { OkButton } from "0-shared/components/OkButton/OkButton";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";

// одностройчный текстовый инпут + кнопки (ок, отмена)

type TClosableOneLineTextInputProps = {
    addClassNames?: string[];
    onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    onCloseSave?: (inputValue: string) => void;
    inputDefValue?: string;
    placeholder?: string;
    inputLabel?: string;
};

const boxStyles = (theme: PaletteMode) => {
    return {
        padding: "3px",
        fontSize: "2rem",
        backgroundColor: theme === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        borderRadius: "2px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        boxShadow: "0px 1px 4px -2px black",
        width: "fit-content",
        columnGap: "3px",
    } as SxProps;
};

const inputStyle: SxProps = {
    paddingLeft: "4px",
    fontSize: "1.4rem",
    width: "100%",
};

const dividerStyle: SxProps = {
    height: 28,
    padding: "3px",
};

/**
 * одностройчная форма для ввода текста, с кнопками (закрыть\подтвердить)
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClose - вызывается при нажатии на кнопку закрыть
 * @prop onCloseSave(inputValue) - вызывается нажатии на кнопку подтвердить, inputValue - текст в форме на момент вызова
 * @prop inputDefValue - дефолтное значение в форме
 * @prop placeholder - плейсхолдер формы
 * @returns
 */
function ClosableOneLineTextInput({ addClassNames = [], onClose, onCloseSave, inputDefValue = "", placeholder, inputLabel }: TClosableOneLineTextInputProps) {
    const defaultClassName = "ClosableOneLineTextInput";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();
    const [inputValue, setInputValue] = useState(inputDefValue);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const onSave = () => {
        onCloseSave && onCloseSave(inputValue);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            onClose && onClose(e);
        }

        if (e.key === "Enter") {
            onCloseSave && onCloseSave(inputValue);
        }
    };

    return (
        <Box className={genClassName} component={"div"} sx={boxStyles(themeValue)}>
            <TextField
                value={inputValue}
                placeholder={placeholder}
                onChange={onInputChange}
                sx={inputStyle}
                onKeyDown={onKeyDown}
                variant="outlined"
                label={inputLabel}
                autoFocus
            />

            <OkButton onClick={onSave} />
            <CloseButton onClick={onClose} />
        </Box>
    );
}

export { ClosableOneLineTextInput };
