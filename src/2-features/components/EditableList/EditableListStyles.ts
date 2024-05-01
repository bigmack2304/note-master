import type { PaletteMode } from "@mui/material";
import type { TBodyComponentList } from "0-shared/types/dataSave";

function genListDopClasses(data: {
    listBg: TBodyComponentList["background"];
    listIsNumeric: TBodyComponentList["isNumeric"];
    aligin: TBodyComponentList["textAligin"];
    theme: PaletteMode;
    isEdit: boolean;
}) {
    const classes: string[] = [];

    if (data.listBg) {
        if (data.theme === "light") {
            classes.push("NoteList--bg-light");
        }
        if (data.theme === "dark") {
            classes.push("NoteList--bg-dark");
        }
    }

    if (data.isEdit) {
        classes.push("NoteList--editable");
    }

    if (data.listIsNumeric) {
        classes.push("NoteList--type-number");
    }

    if (data.aligin === "center") {
        classes.push("NoteList--aligin-center");
    }

    if (data.aligin === "left") {
        classes.push("NoteList--aligin-left");
    }

    if (data.aligin === "right") {
        classes.push("NoteList--aligin-right");
    }

    return classes;
}

export { genListDopClasses };
