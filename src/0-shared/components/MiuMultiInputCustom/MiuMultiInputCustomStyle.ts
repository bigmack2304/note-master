import { PaletteMode, SxProps } from "@mui/material";

function MiuMultiInputCustom__input(minRow: number, maxRow: number | undefined): SxProps {
    let prepareMaxRow = maxRow ?? minRow;
    if (prepareMaxRow < minRow) prepareMaxRow = minRow;

    return {
        minHeight: `${1 * minRow}rem`,
        ...(maxRow ? { maxHeight: `calc(${prepareMaxRow * 1.4375}rem)` } : {}),
    };
}

function MiuMultiInputCustom(theme: PaletteMode): SxProps {
    return {
        "&": {
            outline: `1px ${theme === "light" ? "#c4c4c4" : "#8f8f8f"} solid`,
        },
        "&:not(:has(.MiuMultiInputCustom__input[disabled])):hover": {
            outline: `1px ${theme === "light" ? "#212121" : "white"} solid`,
        },

        "&:has(.MiuMultiInputCustom__input.Mui-focused), &:has(.MiuMultiInputCustom__input.Mui-focused):hover": {
            outline: `2px ${theme === "light" ? "#288CEF" : "white"} solid`,
        },
    };
}

export { MiuMultiInputCustom__input, MiuMultiInputCustom };
