import React from "react";
import type { TMenuContentProps } from "1-entities/components/MenuContent/MenuContent";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import Switch from "@mui/material/Switch";
import { setHGLGTagsInForms } from "5-app/GlobalState/settingsStore";

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
            <Switch size="medium" checked={isColoring} onChange={onChange} />
        </>
    );
}

const TagColoringInFormsMemo = React.memo(TagColoringInForms);

export { TagColoringInForms, TagColoringInFormsMemo };
