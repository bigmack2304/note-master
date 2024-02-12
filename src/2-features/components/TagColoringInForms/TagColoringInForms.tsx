import React from "react";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import Switch from "@mui/material/Switch";
import { setHGLGTagsInForms } from "5-app/GlobalState/settingsStore";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption">OFF</Typography>
                <Switch size="medium" checked={isColoring} onChange={onChange} />
                <Typography variant="caption">ON</Typography>
            </Stack>
        </>
    );
}

const TagColoringInFormsMemo = React.memo(TagColoringInForms);

export { TagColoringInForms, TagColoringInFormsMemo };
