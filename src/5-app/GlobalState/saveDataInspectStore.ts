import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IDataTreeNote, IDataTreeFolder, IDataSave } from "0-shared/types/dataSave";
import { mergeNodeById } from "2-features/utils/saveDataEdit";
import { deleteById } from "2-features/utils/saveDataEdit";

// взаимодействия с папками и заметками, и все нужные данные для этого

interface ISaveDataInspectStore {
    currentFolder: Omit<IDataTreeFolder, "children"> | undefined;
    currentNote: IDataTreeNote | undefined;
}

const initialState: ISaveDataInspectStore = {
    currentFolder: undefined,
    currentNote: undefined,
};

// в начале загружаем значения из localStorage
init_values();
function init_values() {}

/**
 * слой redux store, содержит параметры связанные с редактированием дерева заметок
 */
const saveDataInspectSlice = createSlice({
    name: "saveDataInspect",
    initialState,
    reducers: {
        // задаем активную папку
        setCurrentFolder: (state, action: PayloadAction<ISaveDataInspectStore["currentFolder"]>) => {
            state.currentFolder = action.payload;
        },
        // задаем активную заметку
        setCurrentNote: (state, action: PayloadAction<ISaveDataInspectStore["currentNote"]>) => {
            state.currentNote = action.payload;
        },
        // удаляем активную заметку из стора и из indexedDB
        deleteCurrentNote_and_noteIndb: (state, action: PayloadAction<[IDataTreeNote, IDataSave]>) => {
            if (action.payload[0].id === "root") return;
            state.currentNote = undefined;
            deleteById(action.payload[1], action.payload[0].id);
        },
        // удаляем активную папку из стора и из indexedDB
        deleteCurrentFolder_and_folderIndb: (state, action: PayloadAction<[IDataTreeFolder, IDataSave]>) => {
            if (action.payload[0].id === "root") return;
            state.currentFolder = undefined;
            deleteById(action.payload[1], action.payload[0].id);
        },
        // удаляем папку из indexedDB
        deleteFolderInDb: (state, action: PayloadAction<[IDataTreeFolder, IDataSave]>) => {
            if (action.payload[0].id === "root") return;
            deleteById(action.payload[1], action.payload[0].id);
        },
        // удаляем заметку из indexedDB
        deleteNoteInDb: (state, action: PayloadAction<[IDataTreeNote, IDataSave]>) => {
            if (action.payload[0].id === "root") return;
            deleteById(action.payload[1], action.payload[0].id);
        },
        // обновляем данные в активной заметке и в indexedDB
        updateNote: (state, action: PayloadAction<ISaveDataInspectStore["currentNote"]>) => {
            state.currentNote = action.payload;
            if (!action.payload) return;
            mergeNodeById(action.payload);
        },
    },
});

export const { setCurrentFolder, setCurrentNote, updateNote, deleteCurrentNote_and_noteIndb, deleteCurrentFolder_and_folderIndb, deleteFolderInDb, deleteNoteInDb } =
    saveDataInspectSlice.actions;
export const { reducer } = saveDataInspectSlice;
export { saveDataInspectSlice };
export type { ISaveDataInspectStore };
