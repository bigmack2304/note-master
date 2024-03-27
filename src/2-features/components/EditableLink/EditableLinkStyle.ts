function genTextDopClasses(data: { isEdit: boolean; isBg: boolean }) {
    const classes: string[] = [];

    if (data.isEdit) {
        classes.push("NoteLink--editable");
    }

    if (data.isBg) {
        classes.push("NoteLink--bg");
    }

    return classes;
}

export { genTextDopClasses };
