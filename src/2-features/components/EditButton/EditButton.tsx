import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { toggleIsEdit } from "5-app/GlobalState/noteStore";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import "./style.scss";

type TNoteEditButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    type?: HTMLButtonElement["type"];
};

/**
 * круглая кнопка "редактировать"
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop type - возможность установить тип кнопки, на случай если будет юзатся с формой
 */
function NoteEditButton({ onClick = () => {}, addClassNames = [], type }: TNoteEditButtonProps) {
    const defaultClassName = "NoteEditButton";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const dispatch = useAppDispatch();
    const isProjectOpen = useAppSelector((state) => state.saveDataInspect.isProjectOpen);
    const isEdit = useAppSelector((state) => state.noteEditData.isEdit);

    if (isEdit) {
        genClassName = genClassName.concat(" ", "NoteEditButton--checked");
    }

    const onButtonClick = (e: React.MouseEvent) => {
        dispatch(toggleIsEdit());
        onClick && onClick(e);
    };

    return (
        <IconButton
            className={genClassName}
            type={type}
            aria-label="Редактировать заметку"
            onClick={onButtonClick}
            title="Редактировать заметку"
            disabled={!isProjectOpen}
            size="small"
        >
            <EditIcon fontSize="small" />
        </IconButton>
    );
}

export { NoteEditButton };
