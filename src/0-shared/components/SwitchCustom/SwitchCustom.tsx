import React from "react";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import * as style from "./SwitchCustomStyle";
import Typography from "@mui/material/Typography";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import "./SwitchCustom.scss";
import type { SwitchProps } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";

type TSwitchCustomProps = {
    onChange?: (e: React.ChangeEvent, checked: boolean) => void;
    addClassNames?: string[];
    switchSettings?: SwitchProps;
    containerSettings?: GetProps<typeof Stack>;
    size?: "small" | "medium";
    checked?: boolean;
};
/**
 * переключалка
 *
 * @prop onChange вызывается при переключении переключалки
 * @prop addClassNames массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop containerSettings пропсы для внешней обертки переключалки
 * @prop switchSettings дополнительные пропсы для mui Switch
 * @prop size (default medium) размер переключателя
 * @prop checked (default false) состояние вкл или выкл
 */
function SwitchCustom({ onChange, addClassNames = [], switchSettings = {}, containerSettings = {}, size = "medium", checked = false }: TSwitchCustomProps) {
    const defaultClassName = "SwitchCustom";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();

    const onSwitchChange = (e: React.ChangeEvent, checked: boolean) => {
        onChange && onChange(e, checked);
    };

    return (
        <>
            <Stack {...containerSettings} sx={style.switchStyle(themeValue)} direction="row" spacing={1} alignItems="center" className={genClassName}>
                <Typography variant="caption" className="SwitchCustom__valName">
                    OFF
                </Typography>
                <Switch {...switchSettings} size={size} checked={checked} onChange={onSwitchChange} />
                <Typography variant="caption" className="SwitchCustom__valName">
                    ON
                </Typography>
            </Stack>
        </>
    );
}

export { SwitchCustom };
