import type { PaletteMode } from "@mui/material";
import type { TBodyComponentText } from "0-shared/types/dataSave";

function genTextDopClasses(data: { textBackground: boolean; textFormat: boolean; fontType: TBodyComponentText["font"]; theme: PaletteMode; lineBreak: boolean; isEdit: boolean }) {
    const classes: string[] = [];

    if (data.textBackground) {
        if (data.theme === "light") {
            classes.push("NoteText--bg-light");
        }
        if (data.theme === "dark") {
            classes.push("NoteText--bg-dark");
        }
    }

    if (data.isEdit) {
        classes.push("NoteText--editable");
    }

    if (!data.textFormat) {
        classes.push("NoteText--noFormat");
    }

    if (data.fontType === "code") {
        classes.push("NoteText--font-code");
    }

    if (!data.lineBreak) {
        classes.push("NoteText--overflowXScroll");
    }

    return classes;
}

export { genTextDopClasses };
