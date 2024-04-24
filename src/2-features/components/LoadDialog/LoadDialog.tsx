import React, { useState, useId } from "react";
import { Typography, MenuItem, Select, OutlinedInput, InputLabel, FormControl } from "@mui/material";
import { DialogWindowAlt } from "1-entities/components/DialogWindowAlt/DialogWindowAlt";
import "./LoadDialog.scss";
import type { SelectChangeEvent } from "@mui/material";

type TLoadDialogprops = {
    addClassNames?: string[];
    isOpen: boolean;
    onClose?: () => void;
    onCloseSave?: (selectVal: TSelevtVal) => void;
};

type TSelevtVal = "fs" | "db";

/**
 * диалог загрузки фаила
 * @prop clickCallback - вызывается при клике на нее
 * @prop disabled - boolean для значения disabled этой кнопки
 */
function LoadDialog({ addClassNames = [], isOpen, onClose, onCloseSave }: TLoadDialogprops) {
    const defaultClassName = "LoadDialog";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const selectLabelID = useId();
    const [selectValue, setSelectValue] = useState<TSelevtVal>("fs");

    const onSelectChange = (e: SelectChangeEvent<TSelevtVal>) => {
        const selectValue = e.target.value as TSelevtVal;
        setSelectValue(selectValue);
    };

    const dialogClose = () => {
        onClose && onClose();
    };

    const dialogCloseSave = () => {
        onCloseSave && onCloseSave(selectValue);
    };

    return (
        <DialogWindowAlt
            isOpen={isOpen}
            addClassNames={[genClassName]}
            actionButton
            actionButtonName="Подтвердить"
            headerText="Загрузка проекта"
            onClose={dialogClose}
            onCloseSave={dialogCloseSave}
        >
            <Typography variant="body1">Выберете источник для загрузки проекта.</Typography>
            <FormControl>
                <InputLabel id={selectLabelID}>Источник загрузки</InputLabel>
                <Select
                    onChange={onSelectChange}
                    value={selectValue}
                    label="Источник загрузки"
                    required
                    labelId={selectLabelID}
                    input={<OutlinedInput label="Источник загрузки" />}
                >
                    <MenuItem value={"fs"}>
                        <Typography variant="body1">Фаиловая система</Typography>
                    </MenuItem>
                    <MenuItem value={"db"}>
                        <Typography variant="body1">Сохраненный проект</Typography>
                    </MenuItem>
                </Select>
            </FormControl>
        </DialogWindowAlt>
    );
}

export { LoadDialog };
