import React from "react";
import Chip from "@mui/material/Chip";
import type { SxProps } from "@mui/material";
import type { IGlobalTag, TTagColors } from "0-shared/types/dataSave";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { PaletteMode } from "@mui/material";
import { TAGS_COLORS_LIGHT } from "5-app/settings";

type TNoteTagProps = {
    isEdit: boolean;
    onDel?: (tagData: IGlobalTag) => void;
    addClassNames?: string[];
    tagObj: IGlobalTag;
};

const noteEditBlockStyles = (color: TTagColors, theme: PaletteMode) => {
    return {
        backgroundColor: TAGS_COLORS_LIGHT[color],
        fontWeight: "600",
        color: "black",
    } as SxProps;
};

/**
 * тег заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop onDel(tagObj) - вызывается при нажатии на кнопку удалить, если есть isEdit
 * @prop tagObj - обьект типа IGlobalTag
 * @prop isEdit - разрешить редактир.
 */
function NoteTag({ onDel, addClassNames = [], tagObj, isEdit }: TNoteTagProps) {
    const defaultClassName = "NoteTag";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();

    const handleDelete = () => {
        onDel && onDel(tagObj);
    };

    return <Chip className={genClassName} label={tagObj.tag_name} onDelete={isEdit ? handleDelete : undefined} sx={noteEditBlockStyles(tagObj.color, themeValue)} />;
}

export { NoteTag };
