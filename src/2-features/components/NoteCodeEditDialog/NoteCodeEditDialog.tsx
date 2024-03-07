import React, { useState, useId } from "react";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import { List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Typography, TextField } from "@mui/material";
import type { SxProps, SelectChangeEvent } from "@mui/material";
import type { TBodyComponentCode } from "0-shared/types/dataSave";
import { codeLanguages } from "0-shared/components/NoteCode/NoteCodeValues";
import { SwitchCustom } from "0-shared/components/SwitchCustom/SwitchCustom";
import "./style.scss";

type TOnSaveType = {
    selectCodeTheme: TBodyComponentCode["codeTheme"];
    selectCodeLanguage: TBodyComponentCode["language"];
    isExpand: TBodyComponentCode["isExpand"];
    expandDesc: TBodyComponentCode["expandDesc"];
};

type TNoteCodeEditDialogProps = {
    onClose?: (e: React.MouseEvent) => void;
    onCloseSave?: (data: TOnSaveType) => void;
    dialogHeader?: string;
    componentData: TBodyComponentCode;
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
 * @prop componentData - компонент внутри заметки который мы редактируем
 */
function NoteCodeEditDialog({ onClose, onCloseSave, dialogHeader = "Управление кодом", componentData }: TNoteCodeEditDialogProps) {
    const [selectCodeTheme, setSelectCodeTheme] = useState<TBodyComponentCode["codeTheme"]>(componentData.codeTheme);
    const [selectCodeLanguage, setSelectCodeLanguage] = useState<TBodyComponentCode["language"]>(componentData.language);
    const [isExpand, setIsEcpand] = useState<TBodyComponentCode["isExpand"]>(componentData.isExpand);
    const [expandDesc, setExpandDesc] = useState<TBodyComponentCode["expandDesc"]>(componentData.expandDesc);
    const [inputLangValue, setInputLangValue] = useState<string>("");
    const selectThemeLabelID = useId();
    const selectLanguageLabelID = useId();

    const onSave = () => {
        onCloseSave && onCloseSave({ selectCodeTheme, selectCodeLanguage, isExpand, expandDesc });
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

    const onExpandChange = (e: React.ChangeEvent<Element>, checked: boolean) => {
        setIsEcpand(checked);
    };

    const onExpandDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpandDesc(e.target.value);
    };

    return (
        <DialogWindowAlt isOpen={true} onClose={onClose} onCloseSave={onSave} headerText={dialogHeader} actionButtonName="Сохранить" actionButton>
            <List className="NoteCodeEditDialog__content">
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
                    <TextField className="NoteCodeEditDialog__syntax_find" placeholder="поиск языка" onChange={onInputLanguageChange} value={inputLangValue} />
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
                <ListItem divider>
                    <ListItemText>Раскрываемый компонент</ListItemText>
                    <SwitchCustom onChange={onExpandChange} checked={isExpand} />
                </ListItem>
                <ListItem divider>
                    <ListItemText>Описание содержимого</ListItemText>
                    <TextField value={expandDesc} onChange={onExpandDescChange} className="NoteCodeEditDialog__expand_desc" label="Описание" variant="outlined" />
                </ListItem>
            </List>
        </DialogWindowAlt>
    );
}

export { NoteCodeEditDialog };
export type { TOnSaveType };
