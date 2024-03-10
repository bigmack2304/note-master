import React, { useState, useId, useEffect, useLayoutEffect } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import type { SxProps, SelectChangeEvent } from "@mui/material";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import type { TBodyComponentList } from "0-shared/types/dataSave";

type TNoteListEditDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (data: { listBg: TBodyComponentList["background"]; isNumeric: TBodyComponentList["isNumeric"]; aligin: TBodyComponentList["textAligin"] }) => void;
    dialogHeader?: string;
    componentData: TBodyComponentList;
};

const listStyles = () => {
    return {
        "& .MuiListItem-root": {
            padding: "10px 0px",
            columnGap: "20px",
        },
        "& .MuiSelect-select": {
            minWidth: "160px",
        },
    } as SxProps;
};

const aliginNames: Record<TBodyComponentList["textAligin"], string> = {
    center: "по центру",
    left: "лево",
    right: "право",
};

/**
 * Диалоговое окно с формой для редактирования списка в заметке
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 * @prop editId - id сущьности которую редактируем
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function NoteListEditDialog({ onClose, onCloseSave, dialogHeader = "Управление списком", componentData }: TNoteListEditDialogProps) {
    const [listBackground, setlistBackground] = useState(componentData.background);
    const [selectAligin, setSelectAligin] = useState<TBodyComponentList["textAligin"]>(componentData.textAligin);
    const [typeNumeric, setTypeNumeric] = useState(componentData.isNumeric);
    const selectAliginLabelID = useId();

    const onSave = () => {
        onCloseSave && onCloseSave({ listBg: listBackground, isNumeric: typeNumeric, aligin: selectAligin });
    };

    const onBgChange = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setlistBackground(checked);
    };

    const onNubericChange = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setTypeNumeric(checked);
    };

    const onSelectAliginChange = (e: SelectChangeEvent) => {
        setSelectAligin(e.target.value as TBodyComponentList["textAligin"]);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <List sx={listStyles()}>
                <ListItem divider>
                    <ListItemText>Фон списка</ListItemText>
                    <SwitchCustom onChange={onBgChange} checked={listBackground} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Нумеруемый список</ListItemText>
                    <SwitchCustom onChange={onNubericChange} checked={typeNumeric} />
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

export { NoteListEditDialog };
