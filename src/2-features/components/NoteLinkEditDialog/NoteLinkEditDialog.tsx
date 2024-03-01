import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { List, ListItem, ListItemText, TextField } from "@mui/material";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";
import type { TBodyComponentLink } from "0-shared/types/dataSave";
import * as styles from "./NoteLinkEditDialogStyles";

type TNoteLinkEditDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (data: { isLabel: TBodyComponentLink["isLabel"]; isBg: TBodyComponentLink["background"]; labelVal: TBodyComponentLink["labelValue"] }) => void;
    dialogHeader?: string;
    componentData: TBodyComponentLink;
};

/**
 * Диалоговое окно с формой для редактирования ссылки в заметке
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 * @prop editId - id сущьности которую редактируем
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function NoteLinkEditDialog({ onClose, onCloseSave, dialogHeader = "Управление ссылкой", componentData }: TNoteLinkEditDialogProps) {
    const [isLabel, setIsLabel] = useState<TBodyComponentLink["isLabel"]>(componentData.isLabel);
    const [isBg, setIsBg] = useState<TBodyComponentLink["background"]>(componentData.background);
    const [labelVal, setLabelVal] = useState<TBodyComponentLink["labelValue"]>(componentData.labelValue);

    const onSave = () => {
        let prepareLabelVal = labelVal === "" || labelVal === "#" ? "Link" : labelVal;
        onCloseSave && onCloseSave({ isLabel, isBg, labelVal: prepareLabelVal });
    };

    const onSwithLabel = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setIsLabel(checked);
    };

    const onSwithBg = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setIsBg(checked);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabelVal(e.target.value as TBodyComponentLink["labelValue"]);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <List sx={styles.listStyles()}>
                <ListItem divider>
                    <ListItemText>Фон</ListItemText>
                    <SwitchCustom onChange={onSwithBg} checked={isBg} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Показать текст</ListItemText>
                    <SwitchCustom onChange={onSwithLabel} checked={isLabel} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Текст</ListItemText>
                    <TextField value={labelVal} label="Текст" onChange={onInputChange} multiline maxRows={3} variant="outlined" sx={styles.labelInputStyles()} />
                </ListItem>
            </List>
        </DialogWindowAlt>
    );
}

export { NoteLinkEditDialog };
