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
import { useEventListener } from "0-shared/hooks/useEventListener";

type TSelectValue = TTagColors | "";

type TColorTagSelectProps = {
    onChange?: (selectValue: TSelectValue) => void;
    defaultValue?: TSelectValue;
    required?: boolean;
    name?: string;
    updateOnEvent?: string | string[];
    resetOnEvent?: boolean;
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
 * @prop defaultValue дефолтное значение селекта
 * @prop required долженли быть селект обязательным
 * @prop name имя селектора, если он будет юзатся в форме
 * @prop updateOnEvent любое имя события на которое нужно подписатся (подписка идет через useEventListener соответстыенно вызов такого события возможен через useEventDispatch)
 * @prop resetOnEvent сброс селекта до значения defaultValue, при появлении события указанного в updateOnEvent
 */
function ColorTagSelect({ onChange, required, name, defaultValue = "", updateOnEvent, resetOnEvent }: TColorTagSelectProps) {
    const selectLabelID = useId();
    const [selectValue, setSelectValue] = useState<TSelectValue>(defaultValue);
    const colorList = Object.keys(TAGS_COLORS_LIGHT) as TTagColors[];
    const themeValue = useTemeMode();

    const selectReset = () => {
        setSelectValue(defaultValue);
    };

    const onCustomEvent = () => {
        if (resetOnEvent) {
            selectReset();
        }
    };

    useEventListener({ onEvent: onCustomEvent, eventName: updateOnEvent });

    const onSelectChange = (e: SelectChangeEvent<TTagColors>) => {
        const colorValue = e.target.value as TSelectValue;
        setSelectValue(colorValue);
        onChange && onChange(colorValue);
    };

    return (
        <FormControl>
            <InputLabel id={selectLabelID}>Цвет</InputLabel>
            <Select
                labelId={selectLabelID}
                onChange={onSelectChange}
                value={selectValue}
                label="Цвет"
                name={name}
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
