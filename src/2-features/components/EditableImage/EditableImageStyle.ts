const genTextDopClasses = (data: { isEdit: boolean }) => {
    const classes: string[] = [];

    if (data.isEdit) {
        classes.push("NotePhotoView--editable");
    }

    return classes;
};

export { genTextDopClasses };
