import React from "react";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { setHGLGTagsInForms } from "5-app/GlobalState/settingsStore";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";

type TTagColoringInFormsProps = {};
/**
 * кнопка переключает подцветку тегов в формах
 * @returns
 */
function TagColoringInForms({}: TTagColoringInFormsProps) {
    const isColoring = useAppSelector((state) => state.settingsData.highlightingTagsInForms);
    const dispatch = useAppDispatch();

    const onChange = (e: React.ChangeEvent, checked: boolean) => {
        dispatch(setHGLGTagsInForms(checked));
    };

    return (
        <>
            <SwitchCustom onChange={onChange} checked={isColoring} />
        </>
    );
}

export { TagColoringInForms };
