import React from "react";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { setConsoleButton } from "5-app/GlobalState/settingsStore";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";

type TButtonVisivbleConsoleButtonProps = {};
/**
 * кнопка переключает отображение статуса заметок в блоке навигации
 * @returns
 */
function ButtonVisivbleConsoleButton({}: TButtonVisivbleConsoleButtonProps) {
    const consoleButton = useAppSelector((state) => state.settingsData.consoleButton);
    const dispatch = useAppDispatch();

    const onChange = (e: React.ChangeEvent, checked: boolean) => {
        dispatch(setConsoleButton(checked));
    };

    return (
        <>
            <SwitchCustom onChange={onChange} checked={consoleButton} />
        </>
    );
}

export { ButtonVisivbleConsoleButton };
