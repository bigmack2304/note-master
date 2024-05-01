import React from "react";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { setViewNoteStatus } from "5-app/GlobalState/settingsStore";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";

type TButtonNoteStatusProps = {};
/**
 * кнопка переключает отображение статуса заметок в заметке
 * @returns
 */
function ButtonNoteStatus({}: TButtonNoteStatusProps) {
    const viewNoteStatus = useAppSelector((state) => state.settingsData.viewNoteStatus);
    const dispatch = useAppDispatch();

    const onChange = (e: React.ChangeEvent, checked: boolean) => {
        dispatch(setViewNoteStatus(checked));
    };

    return (
        <>
            <SwitchCustom onChange={onChange} checked={viewNoteStatus} />
        </>
    );
}

export { ButtonNoteStatus };
