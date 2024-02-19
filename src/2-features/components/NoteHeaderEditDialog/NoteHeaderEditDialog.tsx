import React, { useState, useId } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import type { SxProps, SelectChangeEvent } from "@mui/material";
import type { TBodyComponentHeader } from "0-shared/types/dataSave";

type TNoteHeaderEditDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (data: { textAligin: TBodyComponentHeader["textAligin"]; headerSize: TBodyComponentHeader["headerSize"] }) => void;
    dialogHeader?: string;
    editId?: string;
    componentData: TBodyComponentHeader;
};

const listStyles = () => {
    return {
        "& .MuiListItem-root": {
            padding: "10px 0px",
            columnGap: "20px",
        },
    } as SxProps;
};

const textAliginNames: Record<TBodyComponentHeader["textAligin"], string> = {
    center: "по центру",
    left: "лево",
    right: "право",
};

const headerSizeNames: Record<TBodyComponentHeader["headerSize"], string> = {
    h2: "уровень 2",
    h3: "уровень 3",
    h4: "уровень 4",
    h5: "уровень 5",
    h6: "уровень 6",
};

/**
 * Диалоговое окно с формой для редактирования заголовка в заметке
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 * @prop editId - id сущьности которую редактируем
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function NoteHeaderEditDialog({ onClose, onCloseSave, dialogHeader = "Управление заголовком", editId, componentData }: TNoteHeaderEditDialogProps) {
    const [selectTextAligin, setSelectTextAligin] = useState<TBodyComponentHeader["textAligin"]>(componentData.textAligin);
    const [selectSize, setSelectSize] = useState<TBodyComponentHeader["headerSize"]>(componentData.headerSize);
    const selectAliginLabelID = useId();
    const selectSizeLabelID = useId();

    const onSave = () => {
        onCloseSave && onCloseSave({ textAligin: selectTextAligin, headerSize: selectSize });
    };

    const onSelectTextAliginChange = (e: SelectChangeEvent) => {
        setSelectTextAligin(e.target.value as TBodyComponentHeader["textAligin"]);
    };

    const onSelectSizeChange = (e: SelectChangeEvent) => {
        setSelectSize(e.target.value as TBodyComponentHeader["headerSize"]);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <List sx={listStyles()}>
                <ListItem divider>
                    <ListItemText>Центрирование</ListItemText>
                    <FormControl>
                        <InputLabel id={selectAliginLabelID}>Центрирование</InputLabel>
                        <Select
                            labelId={selectAliginLabelID}
                            value={selectTextAligin}
                            label="Центрирование"
                            onChange={onSelectTextAliginChange}
                            renderValue={(selected) => <Typography variant="body1">{textAliginNames[selected]}</Typography>}
                        >
                            <MenuItem divider value="left">
                                <ListItemText>{textAliginNames["left"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="center">
                                <ListItemText>{textAliginNames["center"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="right">
                                <ListItemText>{textAliginNames["right"]}</ListItemText>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>
                <ListItem divider>
                    <ListItemText>Размер заголовка</ListItemText>
                    <FormControl>
                        <InputLabel id={selectSizeLabelID}>Размер заголовка</InputLabel>
                        <Select
                            labelId={selectSizeLabelID}
                            value={selectSize}
                            label="Размер заголовка"
                            onChange={onSelectSizeChange}
                            renderValue={(selected) => <Typography variant="body1">{headerSizeNames[selected]}</Typography>}
                        >
                            <MenuItem divider value="h2">
                                <ListItemText>{headerSizeNames["h2"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="h3">
                                <ListItemText>{headerSizeNames["h3"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="h4">
                                <ListItemText>{headerSizeNames["h4"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="h5">
                                <ListItemText>{headerSizeNames["h5"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="h6">
                                <ListItemText>{headerSizeNames["h6"]}</ListItemText>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>
            </List>
        </DialogWindowAlt>
    );
}

export { NoteHeaderEditDialog };
