import React from "react";
import { Typography } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";

type TChangeTimeProps = {
    createTime_timestamp?: number;
    lastEditTime_timestamp?: number;
    addClassNames?: string[];
};

const changeTimeTextStyle = (theme: PaletteMode) => {
    return {
        color: theme === "light" ? "#000000b3" : "#FFFFFFB3",
    } as SxProps;
};

/**
 * блок с декстом создания и последнекго редактирования для заметок
 * @prop createTime_timestamp - таймштамп даты создания заметки
 * @prop lastEditTime_timestamp - таймштамп даты последнего редактирования заметки
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function ChangeTime({ addClassNames = [], createTime_timestamp, lastEditTime_timestamp }: TChangeTimeProps) {
    const defaultClassName = "ChangeTime";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeValue = useTemeMode();

    const createTime = createTime_timestamp ? new Date(createTime_timestamp) : new Date();
    const lastEditTime = lastEditTime_timestamp ? new Date(lastEditTime_timestamp) : new Date();
    const formatter = new Intl.DateTimeFormat("ru", { hour12: false, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" });

    return (
        <div className={genClassName}>
            <Typography sx={changeTimeTextStyle(themeValue)} variant="body2">
                Создан: {formatter.format(createTime)}
            </Typography>
            <Typography sx={{ ...changeTimeTextStyle(themeValue), marginTop: "5px" }} variant="body2">
                Последнее редактирование: {formatter.format(lastEditTime)}
            </Typography>
        </div>
    );
}

export { ChangeTime };
