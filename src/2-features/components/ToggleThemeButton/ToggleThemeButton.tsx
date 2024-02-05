import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { setIsAuto, setIsDark } from "5-app/GlobalState/themeStore";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { IThemeState } from "5-app/GlobalState/themeStore";
import type { SxProps } from "@mui/material";

type TButtonVatiant = GetProps<typeof Button>["variant"];
type TButtonCallback = (e: React.MouseEvent) => void;

const buttonStyle: SxProps = {
    width: "100%",
};

function calckButtonVariant(index: number, theme: IThemeState) {
    let variant: TButtonVatiant = "outlined";

    if (!theme.isAuto) {
        if (index === 0 && !theme.isDark) {
            variant = "contained";
        }
        if (index === 1 && theme.isDark) {
            variant = "contained";
        }
    }

    if (theme.isAuto) {
        if (index === 2) {
            variant = "contained";
        }
    }

    return variant;
}

function calcButtonCalback(index: number, lightCallback: TButtonCallback, darkCallback: TButtonCallback, autoCallback: TButtonCallback) {
    let callback: TButtonCallback;

    switch (index) {
        case 0:
            callback = lightCallback;
            break;
        case 1:
            callback = darkCallback;
            break;
        case 2:
            callback = autoCallback;
            break;

        default:
            callback = () => {};
            break;
    }

    return callback;
}

/**
 * блок кнопок для переключения цветовой темы
 * @returns
 */
function ToggleThemeButton() {
    const variants = ["светлая", "темная", "авто"];
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();

    const lightCallback = (e: React.MouseEvent) => {
        dispatch(setIsDark(false));
    };

    const darkCallback = (e: React.MouseEvent) => {
        dispatch(setIsDark(true));
    };

    const autoCallback = (e: React.MouseEvent) => {
        dispatch(setIsAuto(true));
    };

    return (
        <ButtonGroup orientation="horizontal">
            {variants.map((value, index) => {
                const variant = calckButtonVariant(index, theme);
                let callback = calcButtonCalback(index, lightCallback, darkCallback, autoCallback);

                return (
                    <Button variant={variant} onClick={callback} key={index} sx={buttonStyle}>
                        {value}
                    </Button>
                );
            })}
        </ButtonGroup>
    );
}

export { ToggleThemeButton };
