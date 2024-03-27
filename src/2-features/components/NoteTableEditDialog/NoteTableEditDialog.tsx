import React, { useState, useId } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { List, ListItem, ListItemText, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";
import * as styles from "./NoteTableEditDialogStyle";
import type { TBodyComponentTable } from "0-shared/types/dataSave";
import type { SelectChangeEvent } from "@mui/material";

type TNoteTableEditDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (data: { descValue: string; backlight: boolean; viewButtons: boolean; aligin: TBodyComponentTable["aligin"] }) => void;
    dialogHeader?: string;
    componentData: TBodyComponentTable;
};

const aliginNames: Record<TBodyComponentTable["aligin"], string> = {
    center: "по центру",
    left: "лево",
    right: "право",
};

/**
 * Диалоговое окно с формой для редактирования таблицы в заметке
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function NoteTableEditDialog({ onClose, onCloseSave, dialogHeader = "Управление таблицей", componentData }: TNoteTableEditDialogProps) {
    const [descValue, setDescValue] = useState<TBodyComponentTable["desc"]>(componentData.desc);
    const [viewButtons, setViewButtons] = useState<TBodyComponentTable["viewButtons"]>(componentData.viewButtons);
    const [backlight, setBacklight] = useState<TBodyComponentTable["backlight"]>(componentData.backlight);
    const [selectAligin, setSelectAligin] = useState<TBodyComponentTable["aligin"]>(componentData.aligin);
    const selectAliginLabelID = useId();

    const onSave = () => {
        onCloseSave && onCloseSave({ descValue, viewButtons, backlight, aligin: selectAligin });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescValue(e.target.value as TBodyComponentTable["desc"]);
    };

    const onBacklight = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setBacklight(checked);
    };

    const onViewButtons = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setViewButtons(checked);
    };

    const onSelectAliginChange = (e: SelectChangeEvent) => {
        setSelectAligin(e.target.value as TBodyComponentTable["aligin"]);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <List sx={styles.listStyles()}>
                <ListItem divider>
                    <ListItemText>Подцветка строк</ListItemText>
                    <SwitchCustom onChange={onBacklight} checked={backlight} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Элементы управления в режиме просмотра</ListItemText>
                    <SwitchCustom onChange={onViewButtons} checked={viewButtons} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Описание</ListItemText>
                    <TextField value={descValue} onChange={onInputChange} multiline maxRows={3} variant="outlined" sx={styles.inputStyles()} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Центрирование</ListItemText>
                    <FormControl>
                        <InputLabel id={selectAliginLabelID}>Центрирование</InputLabel>
                        <Select
                            labelId={selectAliginLabelID}
                            value={selectAligin}
                            label="Центрирование"
                            onChange={onSelectAliginChange}
                            renderValue={(selected) => <Typography variant="body1">{aliginNames[selected]}</Typography>}
                        >
                            <MenuItem divider value="left">
                                <ListItemText>{aliginNames["left"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="center">
                                <ListItemText>{aliginNames["center"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="right">
                                <ListItemText>{aliginNames["right"]}</ListItemText>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>
            </List>
        </DialogWindowAlt>
    );
}

export { NoteTableEditDialog };
