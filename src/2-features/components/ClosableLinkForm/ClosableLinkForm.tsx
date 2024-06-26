import React, { useState, useId } from "react";
import { TextField } from "@mui/material";
import { Box, FormControl, InputLabel, Select, MenuItem, ListItemText, OutlinedInput, Button, Typography } from "@mui/material";
import { CloseButton } from "0-shared/components/CloseButton/CloseButton";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { OkButton } from "0-shared/components/OkButton/OkButton";
import * as style from "./ClosableLinkFormStyle";
import { SelectNoteButton } from "../SelectNoteButton/SelectNoteButton";
import "./style.scss";
import type { TBodyComponentLink } from "0-shared/types/dataSave";
import type { TRadioData } from "../NoteSelector/NoteSelector";
import type { SelectChangeEvent } from "@mui/material";

// одностройчный текстовый инпут + кнопки (ок, отмена)

type TClosableLinkFormProps = {
    addClassNames?: string[];
    onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    onCloseSave?: (data: { target: TBodyComponentLink["target"]; value: TBodyComponentLink["value"] }) => void;
    urlValue: string;
    placeholder?: string;
    inputLabel?: string;
    target: TBodyComponentLink["target"];
};

/**
 * форма для ввода цели ссылки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onClose - вызывается при нажатии на кнопку закрыть
 * @prop onCloseSave - закрытие с сохранением
 * @prop urlValue - ссылка (это может быть строка типа url либо JSON преобразуемый в обьект типа TRadioData)
 * @prop placeholder - дефолтное значение поля ввода url
 * @prop inputLabel - посути тоже что и placeholder только это типа описание для placeholder
 * @prop target - "web" | "note", из этого параметра скрипты определят как обрабатывать url, ведь ссылка может быть на web ресурс и на заметку
 */
function ClosableLinkForm({ addClassNames = [], onClose, onCloseSave, urlValue, placeholder, inputLabel, target }: TClosableLinkFormProps) {
    const defaultClassName = "ClosableLinkForm";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [selectValue, setSelectValue] = useState<TBodyComponentLink["target"]>(target);
    const [targetNote, setTargetNote] = useState<string>(() => {
        let result = "";

        try {
            result = (JSON.parse(urlValue) as TRadioData).name;
        } catch {}

        return result;
    });
    const selectId = useId();
    const themeValue = useTemeMode();
    const [inputURLValue, setInputURLValue] = useState(urlValue);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputURLValue(e.target.value);
    };

    const onSave = () => {
        onCloseSave && onCloseSave({ target: selectValue, value: inputURLValue });
    };

    const onSelectChange = (e: SelectChangeEvent<typeof selectValue>) => {
        const value = e.target.value;
        setSelectValue(value as typeof selectValue);
        setInputURLValue("");
    };

    const onSelectNoteClose = (selectNoteId: string) => {
        if (selectNoteId == "#" || selectNoteId == "") return;
        setTargetNote((JSON.parse(selectNoteId) as TRadioData).name);
        setInputURLValue(selectNoteId);
    };

    return (
        <Box className={genClassName} component={"div"} sx={style.closableLinkForm(themeValue)}>
            {selectValue === "web" ? (
                <TextField
                    className="ClosableLinkForm__url_input"
                    value={inputURLValue}
                    placeholder={placeholder}
                    onChange={onInputChange}
                    variant="outlined"
                    label={inputLabel}
                    autoFocus
                />
            ) : (
                <Box className="ClosableLinkForm__link_name_wrapper">
                    <Typography variant="body1" component={"p"} className="ClosableLinkForm__link_name" title={targetNote}>
                        {targetNote}
                    </Typography>
                </Box>
            )}
            <Box className="ClosableLinkForm__controls_wrapper">
                <Box className="ClosableLinkForm__result_buttons">
                    <OkButton onClick={onSave} />
                    <CloseButton onClick={onClose} />
                </Box>
                <FormControl className="ClosableLinkForm__select_wrapper">
                    <InputLabel id={selectId}>Цель</InputLabel>
                    <Select
                        labelId={selectId}
                        value={selectValue}
                        label="Цель"
                        onChange={onSelectChange}
                        input={<OutlinedInput label="Цель" />}
                        size="small"
                    >
                        <MenuItem divider value="web">
                            <ListItemText>URL</ListItemText>
                        </MenuItem>
                        <MenuItem divider value="note">
                            <ListItemText>Заметка</ListItemText>
                        </MenuItem>
                    </Select>
                </FormControl>
                {selectValue === "note" && <SelectNoteButton onClose={onSelectNoteClose} selectedNote={inputURLValue} />}
            </Box>
        </Box>
    );
}

export { ClosableLinkForm };
