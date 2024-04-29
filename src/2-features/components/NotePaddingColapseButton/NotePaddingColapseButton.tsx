import React from "react";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { setNoteMarginCollapse } from "5-app/GlobalState/settingsStore";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";

type TNotePaddingColapseButtonProps = {};
/**
 * кнопка уменьшает отступы в заметках //DEPRECATED
 * @returns
 */
function NotePaddingColapseButton({}: TNotePaddingColapseButtonProps) {
    const isColoring = useAppSelector((state) => state.settingsData.noteMarginCollapse);
    const dispatch = useAppDispatch();

    const onChange = (e: React.ChangeEvent, checked: boolean) => {
        dispatch(setNoteMarginCollapse(checked));
    };

    return (
        <>
            <SwitchCustom onChange={onChange} checked={isColoring} />
        </>
    );
}

export { NotePaddingColapseButton };
