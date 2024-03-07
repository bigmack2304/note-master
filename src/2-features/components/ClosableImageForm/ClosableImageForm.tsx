import React, { useState, useId, useRef } from "react";
import { TextField } from "@mui/material";
import { Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, ListItemIcon, ListItemText, Typography, Button } from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import { CloseButton } from "0-shared/components/CloseButton/CloseButton";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { OkButton } from "0-shared/components/OkButton/OkButton";
import { InputImage } from "../InputImage/InputImage";
import * as styles from "./ClosableImageFormStyles";
import "./style.scss";
import type { SelectChangeEvent } from "@mui/material";

// одностройчный текстовый инпут + кнопки (ок, отмена)

type TClosableImageFormProps = {
    addClassNames?: string[];
    onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    onCloseSave?: (imgSrc: string, imgName: string) => void;
    inputUrlDefValue?: string;
    imgName?: string;
};

const selectValuesNames = {
    URL: "URL",
    LOCAL: "Локальный фаил",
};

/**
 * форма для добавления картинки, картинку мы можем добавлять как локально так и по URL
 * это выберается селектом.
 * @prop addClassNames  массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClose вызывается при закрытии окна
 * @prop onCloseSave вызывается при закрытии окна через кнопку сохранить
 * @prop inputUrlDefValue url картинки
 * @prop imgName имя картинки
 */
function ClosableImageForm({ addClassNames = [], onClose, onCloseSave, inputUrlDefValue = "", imgName = "" }: TClosableImageFormProps) {
    const defaultClassName = "ClosableImageForm";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();
    const [inputUrl, setInputUrl] = useState(imgName === "" ? inputUrlDefValue : ""); // если есть имя фаила, значит он был загружен локально. не нужно показывать тут всю base64 картинку
    const [selectValue, setSelectValue] = useState<"URL" | "LOCAL">("URL");
    const [imageName, setImageName] = useState("");
    const selectLabelID = useId();
    const inputImageRef = useRef<HTMLInputElement>(null);

    // срабатывает при изменениях в форме ввода url
    const onInputUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputUrl(e.target.value);
    };

    // закрытие формы с созхранением
    const onSave = () => {
        onCloseSave && onCloseSave(inputUrl, imageName);
    };

    // обработчик кнопок в форме ввода url
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            onClose && onClose(e);
        }

        if (e.key === "Enter") {
            onCloseSave && onCloseSave(inputUrl, imageName);
        }
    };

    // изменения в селекте
    const onSelectChange = (e: SelectChangeEvent<typeof selectValue>) => {
        const value = e.target.value;
        setSelectValue(value as typeof selectValue);
    };

    // сработает когда фаил загрузился
    const onLocalLoad = (data: string, filename: string) => {
        setImageName(filename);
        setInputUrl(data);
    };

    // нажатие на кнопку загрузить фаил
    const onLoadLocalClick = (e: React.MouseEvent) => {
        if (!inputImageRef.current) return;
        inputImageRef.current.click();
    };

    return (
        <>
            <Box className={genClassName} component={"div"} sx={styles.сlosableImageFormStyles(themeValue)}>
                {selectValue === "URL" ? (
                    <TextField
                        className="ClosableImageForm__input_Url"
                        value={inputUrl}
                        placeholder="URL"
                        onChange={onInputUrlChange}
                        onKeyDown={onKeyDown}
                        variant="outlined"
                        label="URL"
                        autoFocus
                    />
                ) : (
                    <Box className="ClosableImageForm__name_wrapper">
                        <Typography className="ClosableImageForm__local_name" title={imageName}>
                            {imageName}
                        </Typography>
                    </Box>
                )}
                <Box className="ClosableImageForm__controls_wrapper">
                    <Box className="ClosableImageForm__result_buttons">
                        <OkButton onClick={onSave} />
                        <CloseButton onClick={onClose} />
                    </Box>
                    <FormControl className="ClosableImageForm__select_wrapper">
                        <InputLabel id={selectLabelID}>Изображение</InputLabel>
                        <Select
                            labelId={selectLabelID}
                            value={selectValue}
                            label="Изображение"
                            onChange={onSelectChange}
                            input={<OutlinedInput label="Изображение" />}
                            size="small"
                            renderValue={(selected) => <Typography variant="body1">{selectValuesNames[selected]}</Typography>}
                        >
                            <MenuItem divider value="LOCAL">
                                <ListItemIcon>
                                    <DevicesIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>{selectValuesNames["LOCAL"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="URL">
                                <ListItemIcon>
                                    <AttachFileIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>{selectValuesNames["URL"]}</ListItemText>
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {selectValue === "LOCAL" && (
                        <Button className="ClosableImageForm__button_local" color="primary" aria-label="Выбрать фаил" size="small" variant="contained" onClick={onLoadLocalClick}>
                            Выбрать фаил
                        </Button>
                    )}
                </Box>
            </Box>
            <InputImage ref={inputImageRef} loadCallback={onLocalLoad} />
        </>
    );
}

export { ClosableImageForm };
