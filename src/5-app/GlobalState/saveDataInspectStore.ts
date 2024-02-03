import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IDataTreeNote, IDataTreeFolder } from "0-shared/types/dataSave";
import { updateNotesTempData } from "2-features/utils/updateTempData";

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

const saveDataInspectSlice = createSlice({
    name: "saveDataInspect",
    initialState,
    reducers: {
        setCurrentFolder: (state, action: PayloadAction<ISaveDataInspectStore["currentFolder"]>) => {
            state.currentFolder = action.payload;
        },
        setCurrentNote: (state, action: PayloadAction<ISaveDataInspectStore["currentNote"]>) => {
            state.currentNote = action.payload;
        },
        updateNote: (state, action: PayloadAction<ISaveDataInspectStore["currentNote"]>) => {
            state.currentNote = action.payload;
            if (!action.payload) return;
            updateNotesTempData(action.payload);
        },
    },
});

export const { setCurrentFolder, setCurrentNote, updateNote } = saveDataInspectSlice.actions;
export const { reducer } = saveDataInspectSlice;
export { saveDataInspectSlice };
export type { ISaveDataInspectStore };
