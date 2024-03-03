import React, { useState } from "react";
import { Typography, TextField } from "@mui/material";
import { ColorTagSelect } from "../ColorTagSelect/ColorTagSelect";
import { OkButton } from "0-shared/components/OkButton/OkButton";
import type { TTagColors } from "0-shared/types/dataSave";
import { projectAddNewTag } from "5-app/GlobalState/saveDataInspectStore";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { useEventDispatch } from "0-shared/hooks/useEventDispatch";
import "./AddNewTagForm.scss";

type TAddNewTagFormProps = {
    addClassNames?: string[];
};

/**
 * компонент с формай для добавления новых тегов в проект
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function AddNewTagForm({ addClassNames = [] }: TAddNewTagFormProps) {
    const defaultClassName = "AddNewTagForm";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [newTagName, setNewTagName] = useState<string>("");
    const [selectValue, setSelectValue] = useState<TTagColors | "">("");
    const dispatch = useAppDispatch();
    const [dispatchEvent] = useEventDispatch({ eventName: "AddNewTagFormSelectReset" });

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        dispatch(projectAddNewTag({ tagColor: selectValue as TTagColors, tagName: newTagName }));

        dispatchEvent(); // сбрасываем значение в селекте
        setNewTagName(""); // сбрасываем значение инпута
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTagName(e.target.value);
    };

    const onSelectChange = (selectColor: TTagColors | "") => {
        setSelectValue(selectColor);
    };

    return (
        <form autoComplete="off" className={genClassName} onSubmit={onFormSubmit}>
            <fieldset className="AddNewTagForm__fieldset">
                <legend>
                    <Typography variant="caption">Добавить новый тег</Typography>
                </legend>
                <div className="AddNewTagForm__inner">
                    <div className="AddNewTagForm__inputs">
                        <TextField value={newTagName} label="Новый тег" placeholder="Имя тега" variant="standard" onChange={onInputChange} required />
                        <ColorTagSelect onChange={onSelectChange} updateOnEvent="AddNewTagFormSelectReset" resetOnEvent required />
                    </div>
                    <OkButton type="submit" />
                </div>
            </fieldset>
        </form>
    );
}

export { AddNewTagForm };
