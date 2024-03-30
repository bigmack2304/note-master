import React, { useRef, useLayoutEffect } from "react";
import { Box, Input } from "@mui/material";
import { deep_object_is_equal } from "0-shared/utils/is_equal";
import type { TTableRowColumnItem } from "0-shared/types/dataSave";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { GetProps } from "0-shared/utils/typeHelpers";
import * as styles from "./TableInputStyle";
import "./TableInput.scss";

type TTableInputProps = {
    hValue: TTableRowColumnItem;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    inputProps?: GetProps<typeof Input>["inputProps"];
    className?: string;
};

/**
 *
 * настроенный инпут для таблицы
 */
function TableInput({ hValue, onChange, onBlur, className, inputProps, onFocus }: TTableInputProps) {
    let genclassName = `TableInput ${className}`;
    const refTextArea = useRef<HTMLTextAreaElement>(null);
    const themeValue = useTemeMode();

    const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!e.target) return;
        const target = e.target as HTMLTextAreaElement;
        target.style.height = ""; //TODO: сброс делать обязательно, иначе высота не сможет уменьшатся
        target.style.height = `${target.scrollHeight}px`;
        onChange && onChange(e);
    };

    const onTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        target.classList.add("Mui-focused");
        onFocus && onFocus(e);
    };

    const onTextareaBlur = (e: React.FocusEvent) => {
        const target = e.target as HTMLTextAreaElement;
        if (!e.relatedTarget?.className.includes("Table_inputValueDubleCell")) {
            target.classList.remove("Mui-focused");
        }
        onBlur && onBlur(e);
    };

    const onTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
    };

    useLayoutEffect(() => {
        if (refTextArea.current !== null) {
            refTextArea.current.style.height = `${refTextArea.current.scrollHeight}px`;
        }
    }, []);

    return (
        <Box
            component={"textarea"}
            sx={styles.textAreaStyle(themeValue)}
            {...inputProps}
            className={genclassName}
            defaultValue={hValue.value}
            autoComplete="off"
            onChange={onTextareaChange}
            onBlur={onTextareaBlur}
            onFocus={onTextareaFocus}
            onClick={onTextareaClick}
            ref={refTextArea}
        ></Box>
    );
}

const TableInput_memo = React.memo(TableInput);
const TableInput_memo_is_equal = React.memo(TableInput, deep_object_is_equal);
export { TableInput, TableInput_memo, TableInput_memo_is_equal };
