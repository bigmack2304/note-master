import React, { useState, useId } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";
import type { SxProps, SelectChangeEvent } from "@mui/material";
import type { TBodyComponentText } from "0-shared/types/dataSave";

type TNoteTextEditDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (data: {
        textBackground: boolean;
        textFormat: boolean;
        fontValue: TBodyComponentText["font"];
        lineBreak: boolean;
    }) => void;
    dialogHeader?: string;
    editId?: string;
    componentData: TBodyComponentText;
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

const fontNames: Record<TBodyComponentText["font"], string> = {
    default: "стандартный шрифт",
    code: "код",
};

/**
 * Диалоговое окно с формой для редактирования текста в заметке
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 * @prop editId - id сущьности которую редактируем
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function NoteTextEditDialog({
    onClose,
    onCloseSave,
    dialogHeader = "Управление текстом",
    editId,
    componentData,
}: TNoteTextEditDialogProps) {
    const [textBackground, setTextBackground] = useState(componentData.background);
    const [textFormat, setTextFormat] = useState(componentData.formatting);
    const [lineBreak, setLineBreak] = useState(componentData.lineBreak);
    const [selectValue, setSelectValue] = useState<TBodyComponentText["font"]>(componentData.font);
    const selectLabelID = useId();

    const onSave = () => {
        onCloseSave && onCloseSave({ textBackground, textFormat, fontValue: selectValue, lineBreak });
    };

    const onBgChange = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setTextBackground(checked);
    };

    const onFormatChange = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setTextFormat(checked);
    };

    const onLineBreak = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setLineBreak(checked);
    };

    const onSelectChange = (e: SelectChangeEvent) => {
        setSelectValue(e.target.value as TBodyComponentText["font"]);
    };

    return (
        <DialogWindowAlt
            isOpen={true}
            onClose={onClose}
            onCloseSave={onSave}
            headerText={dialogHeader}
            actionButtonName="Сохранить"
            actionButton
        >
            <List sx={listStyles()}>
                <ListItem divider>
                    <ListItemText>Фон текста</ListItemText>
                    <SwitchCustom onChange={onBgChange} checked={textBackground} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Автоперенос строки</ListItemText>
                    <SwitchCustom onChange={onLineBreak} checked={lineBreak} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Стандартное форматирование</ListItemText>
                    <SwitchCustom onChange={onFormatChange} checked={textFormat} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Шрифт</ListItemText>
                    <FormControl>
                        <InputLabel id={selectLabelID}>Шрифт</InputLabel>
                        <Select
                            labelId={selectLabelID}
                            value={selectValue}
                            label="Шрифт"
                            onChange={onSelectChange}
                            renderValue={(selected) => <Typography variant="body1">{fontNames[selected]}</Typography>}
                        >
                            <MenuItem divider value="default">
                                <ListItemText>{fontNames["default"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="code">
                                <ListItemText>{fontNames["code"]}</ListItemText>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>
            </List>
        </DialogWindowAlt>
    );
}

export { NoteTextEditDialog };
