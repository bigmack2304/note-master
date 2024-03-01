import React, { useState } from "react";
import { List, ListItem, TextField } from "@mui/material";
import { ColorTagSelect } from "../ColorTagSelect/ColorTagSelect";
import { SaveButton } from "0-shared/components/SaveButton/SaveButton";
import { DeleteButton } from "0-shared/components/DeleteButton/DeleteButton";
import { useTags } from "0-shared/hooks/useTags";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { IGlobalTag, TTagColors } from "0-shared/types/dataSave";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import CircularProgress from "@mui/material/CircularProgress";
import { projectDeleteTag, projectEditTag } from "5-app/GlobalState/saveDataInspectStore";
import { EV_NAME_SAVE_DATA_REDUCER_REJECT } from "5-app/settings";
import * as styles from "./AllTagsEditStyles";
import "./AllTagsEdit.scss";

type TAllTagsEditProps = {
    addClassNames?: string[];
    sortName?: string;
};
/**
 * список всех тегов с возможностью их редактирования
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop sortName - отображать теки которые включают в себя эту подстроку
 */
function AllTagsEdit({ addClassNames = [], sortName = "" }: TAllTagsEditProps) {
    const defaultClassName = "AllTagsEdit";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();
    const [isTagsLoading, setIsTagsLoading] = useState(false);

    const allTags = useTags({
        onStartLoading: () => {
            setIsTagsLoading(true);
        },
        onEndLoading: () => {
            setIsTagsLoading(false);
        },
    });

    const dispatch = useAppDispatch();
    let prepareAllTags: IGlobalTag[] = [];

    if (allTags) {
        prepareAllTags = Object.values(allTags);
        prepareAllTags = prepareAllTags.filter((tag) => {
            if (tag.tag_name.includes(sortName)) return true;
            return false;
        });
    }

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const oldName = form.dataset.oldName;
        const oldColor = form.dataset.oldColor as TTagColors | undefined;
        const newName = formData.get("tagName") as string | null;
        const newColor = formData.get("tagColor") as TTagColors | undefined;

        if (!newName || !newColor || !oldName) return;
        if (oldName !== newName || oldColor !== newColor) {
            dispatch(projectEditTag({ newTagName: newName, newTagColor: newColor, oldTagName: oldName }));
            form.reset(); // сброс нативных инпутов
        }
    };

    const onDeleteClick = (e: React.FormEvent, customData: IGlobalTag) => {
        dispatch(projectDeleteTag({ tagName: customData.tag_name }));
    };

    return (
        <List className={genClassName} sx={styles.dialogInnerListStyle(themeValue)}>
            {isTagsLoading ? (
                <CircularProgress sx={styles.loaderStyle()} />
            ) : (
                prepareAllTags.map((tag) => {
                    return (
                        <ListItem key={tag.tag_name} divider className="AllTagsEdit__Item">
                            <form autoComplete="off" className="AllTagsEdit__form" onSubmit={onFormSubmit} data-old-name={tag.tag_name} data-old-color={tag.color}>
                                {/* TODO: AllTagsEdit__form_inner поставил, иначе при клике в пустое место фармы появлялась ошибка "Failed to execute 'matches' on 'Element'" */}
                                <div className="AllTagsEdit__form_inner">
                                    <div className="AllTagsEdit__inpits">
                                        <TextField
                                            name="tagName"
                                            label="Имя тега"
                                            placeholder="Имя тега"
                                            variant="standard"
                                            defaultValue={tag.tag_name}
                                            autoComplete="off"
                                            required
                                        />
                                        <ColorTagSelect name="tagColor" defaultValue={tag.color} updateOnEvent={EV_NAME_SAVE_DATA_REDUCER_REJECT} resetOnEvent required />
                                    </div>
                                    <div className="AllTagsEdit__Buttons">
                                        <SaveButton size="large" title="Сохранить" type="submit" />
                                        <DeleteButton size="large" title="Удалить" onClick={onDeleteClick} customData={tag} />
                                    </div>
                                </div>
                            </form>
                        </ListItem>
                    );
                })
            )}
        </List>
    );
}

export { AllTagsEdit };
