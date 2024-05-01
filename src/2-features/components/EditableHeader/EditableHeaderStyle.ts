import type { TBodyComponentHeader } from "0-shared/types/dataSave";

const genTextDopClasses = (data: { isEdit: boolean; textAligin: TBodyComponentHeader["textAligin"]; headerSize: TBodyComponentHeader["headerSize"] }) => {
    const classes: string[] = [];

    if (data.isEdit) {
        classes.push("NoteHead--editable");
    }

    switch (data.textAligin) {
        case "left":
            classes.push("NoteHead--aliginLeft");
            break;
        case "center":
            classes.push("NoteHead--aliginCenter");
            break;
        case "right":
            classes.push("NoteHead--aliginRight");
            break;
        default:
            break;
    }

    switch (data.headerSize) {
        case "h2":
            classes.push("NoteHead--sizeH2");
            break;
        case "h3":
            classes.push("NoteHead--sizeH3");
            break;
        case "h4":
            classes.push("NoteHead--sizeH4");
            break;
        case "h5":
            classes.push("NoteHead--sizeH5");
            break;
        case "h6":
            classes.push("NoteHead--sizeH6");
            break;
        default:
            break;
    }

    return classes;
};

export { genTextDopClasses };
