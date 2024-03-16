import React from "react";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { FormControlLabel, Checkbox as MCheckbox } from "@mui/material";
import type { CheckboxProps } from "@mui/material";
import * as style from "./CheckboxStyle";

interface TCheckboxProps {
    label?: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    addClassNames?: string[];
    size?: CheckboxProps["size"];
    dataSet?: { name: string; value: string }[];
}

/**
 * чекбокс
 * @prop label - вызывается при клике на кнопку
 * @prop checked - дефолтное значение чекбокса
 * @prop onChange - вызывается при изменении состояния чекбокса
 * @prop size - размер
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop dataSet - data атрибуты
 */
function Checkbox({ label, checked, onChange, addClassNames = [], size, dataSet }: TCheckboxProps) {
    const defaultClassName = "Checkbox";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();

    const calcDataset = () => {
        if (!dataSet) return {};
        if (dataSet && dataSet.length === 0) return {};
        let temp: any = {};

        for (let dataitem of dataSet) {
            temp[`data-${dataitem.name}`] = dataitem.value;
        }

        return temp;
    };

    const prepareDataSet = calcDataset();

    return (
        <FormControlLabel
            control={
                <MCheckbox
                    size={size}
                    checked={checked}
                    onChange={onChange}
                    className="Checkbox__checkbox"
                    color="primary"
                    sx={style.checkboxLabel(themeValue)}
                    inputProps={{ ...prepareDataSet }}
                />
            }
            label={label}
            className={genClassName}
        />
    );
}

export { Checkbox };
