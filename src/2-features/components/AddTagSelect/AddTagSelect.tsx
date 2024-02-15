import React, { useState, useId } from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { useTags } from "0-shared/hooks/useTags";
import { NoteTag } from "0-shared/components/NoteTag/NoteTag";
import type { IGlobalTag } from "0-shared/types/dataSave";
import type { PaletteMode, SxProps } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";

type TAddTagSelectProps = {
    onChange?: (tagNames: string | string[]) => void;
    sortName?: string;
};

const addTagSelectStyle = (tag: IGlobalTag, isColored: boolean, theme: PaletteMode) => {
    let style = {} as React.CSSProperties;

    if (isColored) {
        let colorMix = theme === "light" ? "#FFFFFF0F" : "#000000";
        let colorOpacyty = theme === "light" ? "60%" : "85%";
        style.backgroundColor = `color-mix(in srgb-linear, ${tag.color}, ${colorMix} ${colorOpacyty})`;
    }

    return style as SxProps;
};

/**
 * позволяет выбрать доступные теги зиметки, с учетом активной заметки
 * @prop onChange функция вызывается при изменении селекта
 * @prop sortName - отображать теки которые включают в себя эту подстроку
 */
function AddTagSelect({ onChange, sortName = "" }: TAddTagSelectProps) {
    const selectLabelID = useId();
    const [selectValue, setSelectValue] = useState<string[]>([]);
    const currentNote = useAppSelector((state) => state.saveDataInspect.currentNote);
    const tagColored = useAppSelector((state) => state.settingsData.highlightingTagsInForms);
    const allTags = useTags();
    const themeValue = useTemeMode();

    // массив доступных тегов. (если в активной заметке есть какието теги то они считаются недоступными)
    const availableTags = (function () {
        if (!allTags) return [] as IGlobalTag[];
        if (!currentNote || !currentNote.tags) return Object.values(allTags);
        let temp = [];
        for (let tag in allTags) {
            if (currentNote.tags.includes(tag)) continue;
            if (tag.includes(sortName)) temp.push(allTags[tag]);
        }
        return temp;
    })();

    const onSelectChange = (event: SelectChangeEvent<typeof selectValue>) => {
        const value = event.target.value;
        setSelectValue(typeof value === "string" ? value.split(",") : value);
        onChange && onChange(value);
    };

    return (
        <FormControl>
            <InputLabel id={selectLabelID}>Теги</InputLabel>
            <Select
                labelId={selectLabelID}
                value={selectValue}
                label="Теги"
                onChange={onSelectChange}
                multiple
                input={<OutlinedInput label="Тег" />}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((tagName) => {
                            return <NoteTag isEdit={false} tagObj={allTags![tagName]} key={tagName} />;
                        })}
                    </Box>
                )}
            >
                {availableTags.map((tag) => {
                    return (
                        <MenuItem value={tag.tag_name} key={tag.tag_name} sx={addTagSelectStyle(tag, tagColored, themeValue)}>
                            {tag.tag_name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}

export { AddTagSelect };
