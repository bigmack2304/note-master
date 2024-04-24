import React, { useState } from "react";
import { IconButton } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";
import { List, ListItem, TextField } from "@mui/material";
import type { PaletteMode, SxProps } from "@mui/material";
import { OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR } from "5-app/settings";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { AllTagsEdit } from "../AllTagsEdit/AllTagsEdit";
import { AddNewTagForm } from "../AddNewTagForm/AddNewTagForm";
import "./NewTagButton.scss";

type TNewTagButtonProps = {
    addClassNames?: string[];
};

const dialogListStyle = (theme: PaletteMode) => {
    return {
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
    } as SxProps;
};

/**
 * кнопка, показывающая диалоговое окно с возможностью добавить новый тег в проект
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function NewTagButton({ addClassNames = [] }: TNewTagButtonProps) {
    const defaultClassName = "NewTagButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const isProjectOpen = useAppSelector((state) => state.saveDataInspect.isProjectOpen);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [findTag, setFindTag] = useState<string>("");
    const themeValue = useTemeMode();

    const onFindTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFindTag(e.target.value);
    };

    const onButtonClick = () => {
        setIsDialogOpen(true);
    };

    const onDialogClose = () => {
        setIsDialogOpen(false);
        setFindTag("");
    };

    return (
        <>
            <IconButton
                className={genClassName}
                aria-label="упраление тегами"
                title={"Упраление тегами"}
                size="small"
                onClick={onButtonClick}
                disabled={!isProjectOpen}
            >
                <LocalOfferIcon fontSize="small" />
            </IconButton>
            <DialogWindow addClassNames={["NewTag_window"]} headerText="Упраление тегами" isOpen={isDialogOpen} onClose={onDialogClose}>
                <List className="NewTag_window__list" sx={dialogListStyle(themeValue)}>
                    <ListItem>
                        <TextField
                            className="NewTag_window__find"
                            value={findTag}
                            label="Поиск тега"
                            placeholder="Название тега"
                            variant="filled"
                            onChange={onFindTagChange}
                            size="small"
                        />
                    </ListItem>
                    <ListItem>
                        <AddNewTagForm />
                    </ListItem>
                </List>
                <AllTagsEdit addClassNames={["NewTag_window__allTagsList"]} sortName={findTag} />
            </DialogWindow>
        </>
    );
}

export { NewTagButton };
