import React from "react";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { setTreeViewNoteStatus } from "5-app/GlobalState/settingsStore";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";

type TButtonTreeNoteStatusProps = {};
/**
 * кнопка переключает отображение статуса заметок в блоке навигации
 * @returns
 */
function ButtonTreeNoteStatus({}: TButtonTreeNoteStatusProps) {
    const treeViewNoteStatus = useAppSelector((state) => state.settingsData.treeViewNoteStatus);
    const dispatch = useAppDispatch();

    const onChange = (e: React.ChangeEvent, checked: boolean) => {
        dispatch(setTreeViewNoteStatus(checked));
    };

    return (
        <>
            <SwitchCustom onChange={onChange} checked={treeViewNoteStatus} />
        </>
    );
}

export { ButtonTreeNoteStatus };
