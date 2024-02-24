import React, { useState } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { List, ListItem, ListItemText, TextField } from "@mui/material";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";
import * as styles from "./NoteImageEditDialogStyle";
import type { TBodyComponentImage } from "0-shared/types/dataSave";

type TNoteImageEditDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (data: { imageDesc: string; isDescHidden: boolean }) => void;
    dialogHeader?: string;
    componentData: TBodyComponentImage;
};

/**
 * Диалоговое окно с формой для редактирования заголовка в заметке
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function NoteImageEditDialog({ onClose, onCloseSave, dialogHeader = "Управление изображением", componentData }: TNoteImageEditDialogProps) {
    const [inputValue, setInputValue] = useState<TBodyComponentImage["desc"]>(componentData.desc);
    const [descHidden, setDescHidden] = useState<TBodyComponentImage["isDescHidden"]>(componentData.isDescHidden);

    const onSave = () => {
        onCloseSave && onCloseSave({ imageDesc: inputValue, isDescHidden: descHidden });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value as TBodyComponentImage["desc"]);
    };

    const onDescHidden = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setDescHidden(checked);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <List sx={styles.listStyles()}>
                <ListItem divider>
                    <ListItemText>Показать описание</ListItemText>
                    <SwitchCustom onChange={onDescHidden} checked={descHidden} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Описание</ListItemText>
                    <TextField value={inputValue} label="Описание" onChange={onInputChange} multiline maxRows={3} variant="outlined" sx={styles.inputStyles()} />
                </ListItem>
            </List>
        </DialogWindowAlt>
    );
}

export { NoteImageEditDialog };
