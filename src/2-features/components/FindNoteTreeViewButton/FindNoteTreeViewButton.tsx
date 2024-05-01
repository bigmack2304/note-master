import React, { useState } from "react";
import { FindNoteButton } from "0-shared/components/FindNoteButton/FindNoteButton";
import { setFindNodeTree, resetFindNodeTree } from "5-app/GlobalState/toolBarStore";
import { FindNoteDialog } from "../FindNoteDialog/FindNoteDialog";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { deep_array_is_equal } from "0-shared/utils/is_equal";
import "./FindNoteTreeViewButton.scss";

type TFindNoteTreeViewButtonProps = {
    addClassNames?: string[];
    type?: HTMLButtonElement["type"];
};

/**
 * круглая кнопка "показать кнопки панели навигации"
 * @prop onClick - вызывается при клике на кнопку
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop type - возможность установить тип кнопки, на случай если будет юзатся с формой
 */
function FindNoteTreeViewButton({ addClassNames = [], type }: TFindNoteTreeViewButtonProps) {
    const defaultClassName = "FindNoteTreeViewButton";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const isProjectOpen = useAppSelector((state) => state.saveDataInspect.isProjectOpen);
    const findData = useAppSelector((state) => state.toolBar.findNodeTree);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dispatch = useAppDispatch();

    const onButtonClick = (e: React.MouseEvent) => {
        setIsDialogOpen(true);
    };

    const onDialogClose = () => {
        setIsDialogOpen(false);
    };

    const onDialogReset = () => {
        setIsDialogOpen(false);
        if (!findData) return;
        dispatch(resetFindNodeTree());
    };

    const onDialogCloseSave = (nameValue: string, selectValue: string[], contentValue: string) => {
        setIsDialogOpen(false);

        if (nameValue !== "" || selectValue.length > 0 || contentValue !== "") {
            if (findData) {
                if (findData.name !== nameValue || !deep_array_is_equal(findData.tags, selectValue) || findData.content !== contentValue) {
                    dispatch(setFindNodeTree({ name: nameValue, tags: selectValue, content: contentValue }));
                }
            } else {
                dispatch(setFindNodeTree({ name: nameValue, tags: selectValue, content: contentValue }));
            }
            return;
        }

        dispatch(resetFindNodeTree());
    };

    return (
        <>
            <FindNoteButton
                addClassNames={[genClassName]}
                disabled={!isProjectOpen}
                onClick={onButtonClick}
                size="small"
                title="Поиск заметки"
                isActive={Boolean(findData)}
            />
            {isDialogOpen && (
                <FindNoteDialog
                    dialogHeader="Поиск заметки"
                    onClose={onDialogClose}
                    onCloseSave={onDialogCloseSave}
                    onReset={onDialogReset}
                    defaultContentValue={findData?.content}
                    defaultNameValue={findData?.name}
                    defaultselectValue={findData?.tags}
                />
            )}
        </>
    );
}

export { FindNoteTreeViewButton };
