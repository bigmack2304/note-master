import type { IDataTreeNote, TNoteBody } from "0-shared/types/dataSave";

// функция для применения изменений к значению value компонента заметки в сторе, песле редактирования
//TODO: потом нужно поработать над этой функцией получше

function mergeNoteComponentValue(note: IDataTreeNote, target_id: string, newValue: string) {
    const newBody = note.body.map((value) => {
        let copy: TNoteBody = {} as any;
        Object.assign(copy, value);
        return copy;
    });

    for (let component of newBody) {
        if (component.id !== target_id) continue;
        component.value = newValue;
    }

    let newNote: IDataTreeNote = {} as any;
    Object.assign(newNote, note);
    newNote.body = newBody;
    console.dir(newNote);
    return newNote;
}

export { mergeNoteComponentValue };
