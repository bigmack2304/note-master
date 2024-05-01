import React, { useState } from "react";
import { DialogWindow } from "1-entities/components/DialogWindow/DialogWindow";
import { List, ListItem, TextField, Box } from "@mui/material";
import * as styles from "./ListEditWindowStyle";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { prepareChildren } from "0-shared/components/NoteList/NoteListFuncs";
import { generateHashCode } from "0-shared/utils/stringFuncs";
import "./ListEditWindow.scss";
import { DeleteButton } from "0-shared/components/DeleteButton/DeleteButton";
import { AddButton } from "0-shared/components/AddButton/AddButton";

type TListEditWindowProps = {
    addClassNames?: string[];
    onCloseSave?: (newData: string) => void;
    listValue?: string;
    isNimeric?: boolean;
    isOpen: boolean;
};

/**
 * кнопка, показывающая диалоговое окно с возможностью добавить новый тег в проект
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function ListEditWindow({ addClassNames = [], isOpen, listValue, onCloseSave, isNimeric }: TListEditWindowProps) {
    const defaultClassName = "ListEditWindow";
    let genClassName = "";
    const [addNewValue, setAddNewValue] = useState<string>("");
    const themeValue = useTemeMode();

    const [processedСontent, setProcessedСontent] = useState(prepareChildren(listValue));

    const calcClassName = () => {
        let tempClassname = defaultClassName.split(" ").concat(addClassNames);

        if (isNimeric) {
            tempClassname.push("ListEditWindow--numeric");
        }

        genClassName = tempClassname.join(" ");
    };

    const updateListValue = (type: "new" | "remove", newValue: string, valIndex: number = 0) => {
        if (type === "new") {
            setProcessedСontent((state) => {
                let newState = [...state, newValue];
                return newState;
            });
        }

        if (type === "remove") {
            setProcessedСontent((state) => {
                let newState = state.filter((value, index) => {
                    if (index !== valIndex) return true;
                    return false;
                });

                return newState;
            });
        }
    };

    const addNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddNewValue(e.target.value);
    };

    const onDialogClose = () => {
        onCloseSave && onCloseSave(JSON.stringify({ li: processedСontent }));
    };

    const onAddFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateListValue("new", addNewValue);
        setAddNewValue("");
    };

    calcClassName();

    return (
        <>
            <DialogWindow addClassNames={[genClassName]} headerText="Редактирование списка" isOpen={isOpen} onClose={onDialogClose}>
                <List className="ListEditWindow__list" sx={styles.dialogListStyle(themeValue)}>
                    <ListItem className="ListEditWindow__list_first_item" divider>
                        <Box className={"ListEditWindow__ul_wrapper"}>
                            <Box component={"ul"}>
                                {processedСontent.map((value, index) => {
                                    const onRemoveClick = () => {
                                        updateListValue("remove", "", index);
                                    };

                                    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                        setProcessedСontent((state) => {
                                            state[index] = e.target.value;
                                            return state;
                                        });
                                    };

                                    return (
                                        <li className="ListEditWindow__li" key={generateHashCode(value, index)}>
                                            <Box className="ListEditWindow__li_inner">
                                                <TextField
                                                    className="ListEditWindow__li_input"
                                                    defaultValue={value}
                                                    variant="standard"
                                                    onChange={onInputChange}
                                                    size="small"
                                                    autoComplete="off"
                                                />

                                                <DeleteButton onClick={onRemoveClick} size="medium" title="Удалить" />
                                            </Box>
                                        </li>
                                    );
                                })}
                            </Box>
                        </Box>
                    </ListItem>
                    <ListItem>
                        <Box component={"form"} className={"ListEditWindow__new_item"} onSubmit={onAddFormSubmit}>
                            <TextField
                                className="ListEditWindow__addNew_input"
                                value={addNewValue}
                                variant="filled"
                                onChange={addNewInputChange}
                                size="small"
                                autoComplete="off"
                            />
                            <AddButton size="large" type="submit" />
                        </Box>
                    </ListItem>
                </List>
            </DialogWindow>
        </>
    );
}

export { ListEditWindow };
