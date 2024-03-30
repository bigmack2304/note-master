import React, { useEffect, useRef } from "react";
import "./MiuMultiInputCustom.scss";
import * as style from "./MiuMultiInputCustomStyle";
import { Box, Input } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";
import { useTemeMode } from "0-shared/hooks/useThemeMode";

type TMiuMultiInputCustomProps = {
    addClassNames?: string[];
    addInputClassNames?: string[];
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent) => void;
    disabled?: boolean;
    maxRow?: number;
    minRow?: number;
    rows?: number;
    inputProps?: GetProps<typeof Input>["inputProps"];
};

/**
 * Упрощенный по функционалу аналог mui input multiline
 * с mui input multiline есть проблема, при ресайзе окна выходит ошибка по resize observer
 * вроде как есть костыльные решения как этого избежать, но эти способы мне не подходят по тем или иным причинам, поэтому заместо него
 * будет этот компонент
 */
function MiuMultiInputCustom({
    addClassNames = [],
    addInputClassNames = [],
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    disabled = false,
    maxRow,
    minRow = 1,
    rows,
    inputProps = {},
}: TMiuMultiInputCustomProps) {
    const defaultClassName = "MiuMultiInputCustom";
    let genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    let defaultInputClassName = "MiuMultiInputCustom__input";
    let genInputClassName = defaultInputClassName.split(" ").concat(addInputClassNames).join(" ");
    let prepMaxRow = maxRow;
    let prepMinRow = minRow;
    const themeValue = useTemeMode();
    const componentRef = useRef<HTMLDivElement>(null);

    if (rows) {
        prepMaxRow = rows;
        prepMinRow = rows;
    }

    const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = ""; //TODO: сброс делать обязательно, иначе высота не сможет уменьшатся
        target.style.height = `${Math.ceil(target.scrollHeight) + 1}px`;
        onChange && onChange(e);
    };

    const onTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        target.classList.add("Mui-focused");
        onFocus && onFocus(e);
    };

    const onTextareaBlur = (e: React.FocusEvent) => {
        const target = e.target as HTMLTextAreaElement;
        target.classList.remove("Mui-focused");
        onBlur && onBlur(e);
    };

    useEffect(() => {
        if (!componentRef.current) return;
        const targetInput = componentRef.current.children[0]! as HTMLTextAreaElement;
        targetInput.style.height = `${Math.ceil(targetInput.scrollHeight) + 1}px`;
    }, []);

    return (
        <Box className={genClassName} sx={style.MiuMultiInputCustom(themeValue)} component={"div"} ref={componentRef}>
            <Box
                sx={style.MiuMultiInputCustom__input(prepMinRow, prepMaxRow)}
                component={"textarea"}
                className={genInputClassName}
                rows={prepMinRow}
                value={value}
                defaultValue={defaultValue}
                onChange={onTextareaChange}
                onFocus={onTextareaFocus}
                onBlur={onTextareaBlur}
                disabled={disabled}
                {...inputProps}
            />
        </Box>
    );
}

export { MiuMultiInputCustom };
