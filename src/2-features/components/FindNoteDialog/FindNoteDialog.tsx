import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { AddTagSelect } from "../AddTagSelect/AddTagSelect";
import { Input, Divider } from "@mui/material";
import Button from "@mui/material/Button";
import "./FindNoteDialog.scss";

type TFindNoteDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onReset?: () => void;
    onCloseSave?: (nameValue: string, selectValue: string[], contentValue: string) => void;
    dialogHeader?: string;
    addClassNames?: string[];
    defaultselectValue?: string[];
    defaultNameValue?: string;
    defaultContentValue?: string;
};

/**
 * окно с поиском зщаметок
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop onReset - вызывается при нажатии на кнопку сброса
 * @prop dialogHeader - заголовок окна
 * @prop addClassNames - массив строк, которые будут добавленны как классы в html компонента
 * @prop defaultselectValue - список выбранных тегов по умолчанию
 * @prop defaultNameValue - искомое имя по умолчанию
 * @prop defaultContentValue - искомое содержимое по умолчанию
 */
function FindNoteDialog({
    onClose,
    onReset,
    onCloseSave,
    dialogHeader,
    addClassNames = [],
    defaultselectValue,
    defaultNameValue,
    defaultContentValue,
}: TFindNoteDialogProps) {
    const defaultClassName = "FindNoteDialog";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [selectValue, setSelectValue] = useState<string[]>(defaultselectValue ? defaultselectValue : []);
    const [inputNameValue, setInputNameValue] = useState(defaultNameValue ? defaultNameValue : "");
    const [inputTagName, setInputTagName] = useState("");
    const [inputContentValue, setInputContentValue] = useState(defaultContentValue ? defaultContentValue : "");

    const onInputNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputNameValue(e.target.value);
    };

    const onInputTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputTagName(e.target.value);
    };

    const onInputContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputContentValue(e.target.value);
    };

    const onSelectChange = (tagNames: string | string[]) => {
        setSelectValue(typeof tagNames === "string" ? tagNames.split(",") : tagNames);
    };

    const onSave = () => {
        onCloseSave && onCloseSave(inputNameValue, selectValue, inputContentValue);
    };

    const onDialogClose = (e: React.MouseEvent) => {
        onClose && onClose(e);
    };

    const onDialogRest = () => {
        onReset && onReset();
    };

    return (
        <DialogWindowAlt
            isOpen={true}
            onClose={onDialogClose}
            onCloseSave={onSave}
            headerText={dialogHeader}
            actionButtonName="Применить"
            actionButton
            addClassNames={[genClassName]}
            dopActionButton={
                <Button variant="contained" onClick={onDialogRest}>
                    сброс
                </Button>
            }
        >
            <Input value={inputNameValue} placeholder="по имяни" onChange={onInputNameChange} className="FindNoteDialog__input" />
            <Divider />
            <Input value={inputTagName} placeholder="поиск тега" onChange={onInputTagNameChange} className="FindNoteDialog__input" />
            <AddTagSelect
                onChange={onSelectChange}
                sortName={inputTagName}
                viewAll
                selectLabel="по тегу"
                defaultValue={defaultselectValue}
            />
            <Divider />
            <Input
                value={inputContentValue}
                placeholder="по содержимому"
                onChange={onInputContentChange}
                className="FindNoteDialog__input"
            />
        </DialogWindowAlt>
    );
}

export { FindNoteDialog };
