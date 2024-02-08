import React, { useState, useId } from "react";
import { TreeEditDialig } from "1-entities/components/TreeEditDialig/TreeEditDialig";
import { Input } from "@mui/material";
import type { SxProps } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";

type TTreeAddNoteDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (inputValue: string, selectValue: string[]) => void;
    dialogHeader?: string;
};

const inputStyle: SxProps = {
    paddingLeft: "4px",
    fontSize: "1.4rem",
    width: "clamp(20px, 400px, 30dvw)",
};

/**
 * Диалоговое окно с формой для добавления новой заметки
 * @ используется при добавлении новой заметки в фаиловую структуру
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 */
function TreeAddNoteDialog({ onClose, onCloseSave, dialogHeader }: TTreeAddNoteDialogProps) {
    const [inputValue, setInputValue] = useState("");
    const [selectValue, setSelectValue] = useState<string[]>([]);
    const selectLabelID = useId();

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const onSelectChange = (event: SelectChangeEvent<typeof selectValue>) => {
        const {
            target: { value },
        } = event;
        setSelectValue(typeof value === "string" ? value.split(",") : value);
    };

    const onSave = () => {
        onCloseSave && onCloseSave(inputValue, selectValue);
    };

    return (
        <TreeEditDialig isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader}>
            <Input value={inputValue} placeholder="имя заметки" onChange={onInputChange} sx={inputStyle} required autoComplete="off" />
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
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    <MenuItem value={"lol kek"}>ПОКА НЕ РИАЛИЗОВАНО</MenuItem>
                </Select>
            </FormControl>
        </TreeEditDialig>
    );
}

export { TreeAddNoteDialog };
