import React, { useState } from "react";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import Typography from "@mui/material/Typography";
import { NoteTag } from "0-shared/components/NoteTag/NoteTag";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY, OUTLINE_DARK_COLOR, OUTLINE_LIGHT_COLOR } from "5-app/settings";
import { useTags } from "0-shared/hooks/useTags";
import "./NoteTagList.scss";
import { AddButton } from "0-shared/components/AddButton/AddButton";
import type { IGlobalTag } from "0-shared/types/dataSave";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { noteDelTag } from "5-app/GlobalState/saveDataInspectStore";
import { NoteAddTagDialog } from "../NoteAddTagDialog/NoteAddTagDialog";
import { noteAddTag } from "5-app/GlobalState/saveDataInspectStore";

type TNoteTagListProps = {};

const noteTagListStyle = (theme: PaletteMode) => {
    return {
        backgroundColor: theme == "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        outline: `1px ${theme == "light" ? OUTLINE_LIGHT_COLOR : OUTLINE_DARK_COLOR} solid`,
    } as React.CSSProperties;
};

/**
 * содержимое для DialogWindow, (страница с настройками)
 */
function NoteTagList({}: TNoteTagListProps) {
    const [isAddTagDialog, setIsAddTagDialog] = useState<boolean>(false);
    const themeValue = useTemeMode();
    const isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit);
    const noteTags = useAppSelector((state) => state.saveDataInspect.currentNote?.tags);
    const tags = useTags();
    const isTags = Boolean(noteTags && tags);
    const dispatch = useAppDispatch();

    const onDelTag = (tagData: IGlobalTag) => {
        dispatch(noteDelTag({ tag: tagData }));
    };

    const onAddTag = () => {
        setIsAddTagDialog(true);
    };

    const addTagDialogClose = () => {
        setIsAddTagDialog(false);
    };

    const addTagDialogCloseSave = (selectValue: string | string[]) => {
        dispatch(noteAddTag({ tag: selectValue }));
        setIsAddTagDialog(false);
    };

    return (
        <>
            <div className="NoteTagList" style={noteTagListStyle(themeValue)}>
                <Typography className="NoteTagList__tags_head" variant="body1">
                    Теги:
                </Typography>
                <div className="NoteTagList__tags">
                    {isTags &&
                        noteTags!.map((tagName) => {
                            //TODO: при удалении тега с открытой заметкой происходит вылит (если тут имя удаленного тега) если нет этой проверки
                            //TODO: это происходит потому что useTags обновляется раньше чем noteTags изза асинхронности + потомычто теги и заметки лежат в разных деревьях и обновляются независимо

                            if (!tags) return;
                            if (!tags[tagName]) return;
                            return <NoteTag isEdit={isNoteEdit} tagObj={tags[tagName]} key={tags[tagName].tag_name} onDel={onDelTag} />;
                        })}
                </div>
                {isNoteEdit && <AddButton onClick={onAddTag} addClassNames={["NoteTagList__edit_button"]} />}
            </div>
            {isAddTagDialog && <NoteAddTagDialog dialogHeader="Добавить тег" onClose={addTagDialogClose} onCloseSave={addTagDialogCloseSave} />}
        </>
    );
}

export { NoteTagList };
export type { TNoteTagListProps };
