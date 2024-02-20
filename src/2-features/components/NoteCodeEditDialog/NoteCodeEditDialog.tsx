import React, { useState, useId } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Typography, Input } from "@mui/material";
import type { SxProps, SelectChangeEvent } from "@mui/material";
import type { TBodyComponentCode } from "0-shared/types/dataSave";
import { codeLanguages } from "0-shared/components/NoteCode/NoteCodeValues";

type TNoteCodeEditDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (selectCodeTheme: TBodyComponentCode["codeTheme"], selectCodeLanguage: TBodyComponentCode["language"]) => void;
    dialogHeader?: string;
    editId?: string;
    componentData: TBodyComponentCode;
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

const codeThemeNames: Record<TBodyComponentCode["codeTheme"], string> = {
    auto: "авто",
    dark: "темная",
    light: "светлая",
};

/**
 * Диалоговое окно с формой для редактирования кода в заметке
 *
 * @prop onClose - вызывается при закрытии окна
 * @prop onCloseSave - вызывается при сохранении текста
 * @prop dialogHeader - заголовок окна
 * @prop editId - id сущьности которую редактируем
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function NoteCodeEditDialog({ onClose, onCloseSave, dialogHeader = "Управление кодом", editId, componentData }: TNoteCodeEditDialogProps) {
    const [selectCodeTheme, setSelectCodeTheme] = useState<TBodyComponentCode["codeTheme"]>(componentData.codeTheme);
    const [selectCodeLanguage, setSelectCodeLanguage] = useState<TBodyComponentCode["language"]>(componentData.language);
    const [inputLangValue, setInputLangValue] = useState<string>("");
    const selectThemeLabelID = useId();
    const selectLanguageLabelID = useId();

    const onSave = () => {
        onCloseSave && onCloseSave(selectCodeTheme, selectCodeLanguage);
    };

    const onselectCodeThemeChange = (e: SelectChangeEvent) => {
        setSelectCodeTheme(e.target.value as TBodyComponentCode["codeTheme"]);
    };

    const onselectCodeLanguageChange = (e: SelectChangeEvent) => {
        setSelectCodeLanguage(e.target.value as TBodyComponentCode["language"]);
    };

    const onInputLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputLangValue(e.target.value);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <List sx={listStyles()}>
                <ListItem divider>
                    <ListItemText>Цветовая тема</ListItemText>
                    <FormControl>
                        <InputLabel id={selectThemeLabelID}>Тема</InputLabel>
                        <Select
                            labelId={selectThemeLabelID}
                            value={selectCodeTheme}
                            label="Тема"
                            onChange={onselectCodeThemeChange}
                            renderValue={(selected) => <Typography variant="body1">{codeThemeNames[selected]}</Typography>}
                        >
                            <MenuItem divider value="auto">
                                <ListItemText>{codeThemeNames["auto"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="dark">
                                <ListItemText>{codeThemeNames["dark"]}</ListItemText>
                            </MenuItem>
                            <MenuItem divider value="light">
                                <ListItemText>{codeThemeNames["light"]}</ListItemText>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>
                <ListItem>
                    <ListItemText></ListItemText>
                    <Input placeholder="поиск языка" onChange={onInputLanguageChange} value={inputLangValue} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Язык</ListItemText>
                    <FormControl>
                        <InputLabel id={selectLanguageLabelID}>Язык</InputLabel>
                        <Select
                            labelId={selectLanguageLabelID}
                            value={selectCodeLanguage}
                            label="Язык"
                            onChange={onselectCodeLanguageChange}
                            renderValue={(selected) => <Typography variant="body1">{selected}</Typography>}
                        >
                            {codeLanguages.map((language) => {
                                if (language.includes(inputLangValue) || language === selectCodeLanguage) {
                                    return (
                                        <MenuItem divider value={language} key={language}>
                                            <ListItemText>{language}</ListItemText>
                                        </MenuItem>
                                    );
                                }
                            })}
                        </Select>
                    </FormControl>
                </ListItem>
            </List>
        </DialogWindowAlt>
    );
}

export { NoteCodeEditDialog };
