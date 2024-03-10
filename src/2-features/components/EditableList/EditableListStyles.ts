import type { PaletteMode } from "@mui/material";
import type { TBodyComponentList } from "0-shared/types/dataSave";

function genListDopClasses(data: { listBg: TBodyComponentList["background"]; listIsNumeric: TBodyComponentList["isNumeric"]; theme: PaletteMode; isEdit: boolean }) {
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

    return classes;
}

export { genListDopClasses };
