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

type TAddTagSelectProps = {
    onChange?: (tagNames: string | string[]) => void;
};

/**
 * позволяет выбрать доступные теги зиметки, с учетом активной заметки
 */
function AddTagSelect({ onChange }: TAddTagSelectProps) {
    const selectLabelID = useId();
    const [selectValue, setSelectValue] = useState<string[]>([]);
    const currentNote = useAppSelector((state) => state.saveDataInspect.currentNote);
    const allTags = useTags();

    // массив доступных тегов. (если в активной заметке есть какието теги то они считаются недоступными)
    const availableTags = (function () {
        if (!allTags) return [] as IGlobalTag[];
        if (!currentNote || !currentNote.tags) return Object.values(allTags);
        let temp = [];
        for (let tag in allTags) {
            if (currentNote.tags.includes(tag)) continue;
            temp.push(allTags[tag]);
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
                            return <NoteTag isEdit={false} tagObj={allTags![tagName]} />;
                        })}
                    </Box>
                )}
            >
                {availableTags.map((tag) => {
                    return (
                        <MenuItem value={tag.tag_name} key={tag.tag_name}>
                            {tag.tag_name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}

export { AddTagSelect };
