import React, { useState, useId } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { FormControl, InputLabel, Select, MenuItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { HeaderIcon } from "0-shared/components/HeaderIcon/HeaderIcon";
import type { SelectChangeEvent } from "@mui/material";
import type { TAllComponents } from "0-shared/types/dataSave";

type TNoteAddComponentDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (selectValue: TAllComponents) => void;
    dialogHeader?: string;
};

const selectValuesNames: Record<TAllComponents, string> = {
    header: "Заголовок",
    text: "текст",
};

/**
 * Диалоговое окно с формой для добавления нового компонента в заметку
 * @ используется при добавлении новой заметки в фаиловую структуру
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 */
function NoteAddComponentDialog({ onClose, onCloseSave, dialogHeader = "Добавить компонент" }: TNoteAddComponentDialogProps) {
    const selectLabelID = useId();
    const [selectValue, setSelectValue] = useState<TAllComponents | "">("");

    const onSelectChange = (event: SelectChangeEvent<TAllComponents>) => {
        setSelectValue(event.target.value as TAllComponents);
    };

    const onSave = () => {
        onCloseSave && onCloseSave(selectValue as TAllComponents);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Добавить" actionButton>
            <FormControl>
                <InputLabel id={selectLabelID}>Компонент</InputLabel>
                <Select
                    labelId={selectLabelID}
                    value={selectValue}
                    label="Компонент"
                    onChange={onSelectChange}
                    required
                    renderValue={(selected) => <Typography variant="body1">{selectValuesNames[selected]}</Typography>}
                >
                    <MenuItem divider value="header">
                        <ListItemIcon>
                            <HeaderIcon svgIconSettings={{ fontSize: "small" }} />
                        </ListItemIcon>
                        <ListItemText>Заголовок</ListItemText>
                    </MenuItem>
                    <MenuItem divider value="text">
                        <ListItemIcon>
                            <TextFieldsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>текст</ListItemText>
                    </MenuItem>
                </Select>
            </FormControl>
        </DialogWindowAlt>
    );
}

export { NoteAddComponentDialog };
