import React from "react";
import IconButton from "@mui/material/IconButton";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import type { SxProps } from "@mui/material";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { setFsTools } from "5-app/GlobalState/settingsStore";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import "./style.scss";

type TFsControlsButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
    type?: HTMLButtonElement["type"];
};

/**
 * круглая кнопка "показать кнопки панели навигации"
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop type - возможность установить тип кнопки, на случай если будет юзатся с формой
 */
function FsControlsButton({ onClick = () => {}, addClassNames = [], type }: TFsControlsButtonProps) {
    const defaultClassName = "FsControlsButton";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const dispatch = useAppDispatch();
    const fsTools = useAppSelector((state) => state.settingsData.fsTools);
    const isProjectOpen = useAppSelector((state) => state.saveDataInspect.isProjectOpen);

    if (fsTools) {
        genClassName = genClassName.concat(" ", "FsControlsButton--checked");
    }

    const onButtonClick = (e: React.MouseEvent) => {
        dispatch(setFsTools(!fsTools));
        onClick && onClick(e);
    };

    return (
        <IconButton
            className={genClassName}
            type={type}
            aria-label="Инструменты навигации"
            onClick={onButtonClick}
            title="Инструменты навигации"
            size="small"
            disabled={!isProjectOpen}
        >
            <AccountTreeIcon fontSize="small" />
        </IconButton>
    );
}

export { FsControlsButton };
