import type { TBodyComponentTable } from "0-shared/types/dataSave";

function genTextDopClasses(data: { isEdit: boolean; aligin: TBodyComponentTable["aligin"] }) {
    const classes: string[] = [];

    if (data.isEdit) {
        classes.push("NoteTable--editable");
    }

    if (data.aligin === "left") {
        classes.push("NoteTable--aligin_left");
    }

    if (data.aligin === "right") {
        classes.push("NoteTable--aligin_right");
    }

    if (data.aligin === "center") {
        classes.push("NoteTable--aligin_center");
    }

    return classes;
}

export { genTextDopClasses };
