import React from "react";
import { Input } from "@mui/material";
import { deep_object_is_equal } from "0-shared/utils/is_equal";
import type { TTableRowColumnItem } from "0-shared/types/dataSave";
import type { GetProps } from "0-shared/utils/typeHelpers";

type TTableInputProps = {
    hValue: TTableRowColumnItem;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
    inputProps?: GetProps<typeof Input>["inputProps"];
    multiline?: boolean;
};

/**
 *
 * настроенный инпут для таблицы
 */
function TableInput({ hValue, onChange, onBlur, className, inputProps, onFocus, multiline = true }: TTableInputProps) {
    return (
        <Input
            type="text"
            defaultValue={hValue.value}
            autoComplete="off"
            className={className}
            inputProps={inputProps}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            multiline={multiline}
        />
    );
}

const TableInput_memo = React.memo(TableInput);
const TableInput_memo_is_equal = React.memo(TableInput, deep_object_is_equal);
export { TableInput, TableInput_memo, TableInput_memo_is_equal };
