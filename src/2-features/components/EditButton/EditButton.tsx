import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import type { SxProps } from "@mui/material";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { toggleIsEdit } from "5-app/GlobalState/noteStore";
import { useAppSelector } from "0-shared/hooks/useAppSelector";

type TNoteEditButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    type?: HTMLButtonElement["type"];
};

const buttonStyle = (isEdit: boolean) => {
    const style: SxProps = {
        padding: "5px",

        ...(isEdit
            ? {
                  "&:not(.Mui-disabled) .MuiSvgIcon-root": {
                      stroke: "black",
                      strokeWidth: "2%",
                      fill: "#ff4d00",
                  },
              }
            : {}),
    };

    return style;
};

/**
 * круглая кнопка "редактировать"
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop type - возможность установить тип кнопки, на случай если будет юзатся с формой
 */
function NoteEditButton({ onClick = () => {}, addClassNames = [], type }: TNoteEditButtonProps) {
    const defaultClassName = "NoteEditButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const dispatch = useAppDispatch();
    const isProjectOpen = useAppSelector((state) => state.saveDataInspect.isProjectOpen);
    const isEdit = useAppSelector((state) => state.noteEditData.isEdit);

    const onButtonClick = (e: React.MouseEvent) => {
        dispatch(toggleIsEdit());
        onClick && onClick(e);
    };

    return (
        <IconButton
            className={genClassName}
            type={type}
            aria-label="Редактировать заметку"
            sx={buttonStyle(isEdit)}
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
