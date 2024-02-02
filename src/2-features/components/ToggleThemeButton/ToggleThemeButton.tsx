import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuto, setIsDark } from "5-app/GlobalState/themeStore";
import type { RootState } from "5-app/GlobalState/store";
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

function ToggleThemeButton() {
    const variants = ["светлая", "темная", "авто"];
    const theme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();

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
