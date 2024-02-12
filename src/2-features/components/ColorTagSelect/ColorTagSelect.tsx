import React, { useState, useId } from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { TTagColors } from "0-shared/types/dataSave";
import type { PaletteMode, SxProps } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { ColorBox } from "0-shared/components/ColorBox/ColorBox";
import { TAGS_COLORS_LIGHT } from "5-app/settings";

type TColorTagSelectProps = {
    onChange?: (selectColor: TTagColors | "") => void;
    defaultVal?: TTagColors | "";
    required?: boolean;
    name?: string;
};

const ColorTagSelectStyle = (theme: PaletteMode) => {
    let style = {
        minWidth: "100px",
    } as React.CSSProperties;

    return style as SxProps;
};

/**
 * выводит селект со всеми возможными цветами тегов
 * @prop onChange(selectColor) вызывается при выборе цвета
 * @prop defaultVal дефолтное значение селекта
 * @prop required долженли быть селект обязательным
 */
function ColorTagSelect({ onChange, defaultVal, required, name }: TColorTagSelectProps) {
    const selectLabelID = useId();
    const [selectValue, setSelectValue] = useState<TTagColors | "">(defaultVal || "");
    const colorList = Object.keys(TAGS_COLORS_LIGHT) as TTagColors[];
    const themeValue = useTemeMode();

    const onSelectChange = (event: SelectChangeEvent<TTagColors>) => {
        const colorValue = event.target.value as TTagColors;
        setSelectValue(colorValue);
        onChange && onChange(colorValue);
    };

    return (
        <FormControl>
            <InputLabel id={selectLabelID}>Цвет</InputLabel>
            <Select
                labelId={selectLabelID}
                value={selectValue}
                label="Цвет"
                name={name}
                onChange={onSelectChange}
                required={required}
                input={<OutlinedInput label="Цвет" />}
                renderValue={(selectedColor) => <ColorBox color={TAGS_COLORS_LIGHT[selectedColor as TTagColors]} />}
                sx={ColorTagSelectStyle(themeValue)}
            >
                {colorList.map((color) => {
                    return (
                        <MenuItem value={color} key={color}>
                            <ColorBox color={TAGS_COLORS_LIGHT[color]} />
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}

export { ColorTagSelect };
