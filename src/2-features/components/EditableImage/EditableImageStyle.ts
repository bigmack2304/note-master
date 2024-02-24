const genTextDopClasses = (data: { isEdit: boolean }) => {
    const classes: string[] = [];

    if (data.isEdit) {
        classes.push("NoteImage--editable");
    }

    return classes;
};

export { genTextDopClasses };
