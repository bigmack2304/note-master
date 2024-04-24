/**
 * обработчик загружаемого фаила (сохранения) заметок
 * @param rawData данные
 * @returns обработанные данные
 */
function inputLoadStringHandler<returnType>(rawData: any) {
    if (typeof rawData !== "string") return new Error("format not supported");
    const data = JSON.parse(rawData);

    if (!("db_type" in data)) return new Error("the file is not a note_Master save");
    if (data.db_type !== "note_Master") return new Error("the file is incompatible with this version of note_master");

    return data as returnType;
}

export { inputLoadStringHandler };
