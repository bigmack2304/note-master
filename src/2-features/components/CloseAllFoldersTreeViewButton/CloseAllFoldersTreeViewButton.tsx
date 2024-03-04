import React from "react";
import IconButton from "@mui/material/IconButton";
import DevicesFoldIcon from "@mui/icons-material/DevicesFold";
import { EV_NAME_BUTTON_CLOSE_TREE_FOLDERS } from "5-app/settings";
import { useEventDispatch } from "0-shared/hooks/useEventDispatch";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import "./style.scss";

type TCloseAllFoldersTreeViewButtonProps = {
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
function CloseAllFoldersTreeViewButton({ onClick = () => {}, addClassNames = [], type }: TCloseAllFoldersTreeViewButtonProps) {
    const defaultClassName = "CloseAllFoldersTreeViewButton";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const isProjectOpen = useAppSelector((state) => state.saveDataInspect.isProjectOpen);
    const [eventDispatch] = useEventDispatch({ eventName: EV_NAME_BUTTON_CLOSE_TREE_FOLDERS });

    const onButtonClick = (e: React.MouseEvent) => {
        onClick && onClick(e);
        eventDispatch();
    };

    return (
        <IconButton className={genClassName} type={type} aria-label="Закрыть все папки" onClick={onButtonClick} title="Закрыть все папки" size="small" disabled={!isProjectOpen}>
            <DevicesFoldIcon fontSize="small" />
        </IconButton>
    );
}

export { CloseAllFoldersTreeViewButton };
