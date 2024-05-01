import React from "react";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { setViewNoteInfo } from "5-app/GlobalState/settingsStore";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";

type TButtonNoteInfoProps = {};
/**
 * кнопка переключает отображение статуса заметок в блоке навигации
 * @returns
 */
function ButtonNoteInfo({}: TButtonNoteInfoProps) {
    const viewNoteInfo = useAppSelector((state) => state.settingsData.viewNoteInfo);
    const dispatch = useAppDispatch();

    const onChange = (e: React.ChangeEvent, checked: boolean) => {
        dispatch(setViewNoteInfo(checked));
    };

    return (
        <>
            <SwitchCustom onChange={onChange} checked={viewNoteInfo} />
        </>
    );
}

export { ButtonNoteInfo };
