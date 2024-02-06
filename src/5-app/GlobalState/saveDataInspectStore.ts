import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IDataTreeNote, IDataTreeFolder, IDataSave, TchildrenType, TNoteBody } from "0-shared/types/dataSave";
import { mergeNodeById, updateNodeName } from "2-features/utils/saveDataEdit";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { deleteById } from "2-features/utils/saveDataEdit";
import { getNodeById_noRoot } from "2-features/utils/saveDataParse";
import { nodeWithoutChildren } from "2-features/utils/saveDataUtils";
import type { RootState } from "5-app/GlobalState/store";
import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";

// взаимодействия с папками и заметками, и все нужные данные для этого

interface ISaveDataInspectStore {
    currentFolder: Omit<IDataTreeFolder, "children"> | undefined;
    currentNote: IDataTreeNote | undefined;
}

const initialState: ISaveDataInspectStore = {
    currentFolder: undefined,
    currentNote: undefined,
};

const createAppSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

// в начале загружаем значения из localStorage
init_values();
function init_values() {}

/**
 * слой redux store, содержит параметры связанные с редактированием дерева заметок
 */
const saveDataInspectSlice = createAppSlice({
    name: "saveDataInspect",
    initialState,
    reducers: (create) => ({
        // задаем активную папку
        setCurrentFolder: create.reducer<ISaveDataInspectStore["currentFolder"]>((state, action) => {
            state.currentFolder = action.payload;
        }),
        // задаем активную заметку
        setCurrentNote: create.reducer<ISaveDataInspectStore["currentNote"]>((state, action) => {
            state.currentNote = action.payload;
        }),
        // удаляем активную заметку из стора и из indexedDB
        deleteCurrentNote_and_noteIndb: create.reducer<[IDataTreeNote, IDataSave]>((state, action) => {
            if (action.payload[0].id === "root") return;
            state.currentNote = undefined;
            deleteById(action.payload[1], action.payload[0].id);
        }),
        // удаляем активную папку из стора и из indexedDB
        deleteCurrentFolder_and_folderIndb: create.reducer<[IDataTreeFolder, IDataSave]>((state, action) => {
            if (action.payload[0].id === "root") return;
            state.currentFolder = undefined;
            deleteById(action.payload[1], action.payload[0].id);
        }),
        // удаляем папку из indexedDB
        deleteFolderInDb: create.reducer<[IDataTreeFolder, IDataSave]>((state, action) => {
            if (action.payload[0].id === "root") return;
            deleteById(action.payload[1], action.payload[0].id);
        }),
        // удаляем заметку из indexedDB
        deleteNoteInDb: create.reducer<[IDataTreeNote, IDataSave]>((state, action) => {
            if (action.payload[0].id === "root") return;
            deleteById(action.payload[1], action.payload[0].id);
        }),
        // обновляем данные в активной заметке и в indexedDB
        updateNote: create.reducer<ISaveDataInspectStore["currentNote"]>((state, action) => {
            state.currentNote = action.payload;
            if (!action.payload) return;
            mergeNodeById(action.payload);
        }),
        // переименование ноды
        renameNodeName: create.asyncThunk<{ nodeId: string; newName: string }, { node: TchildrenType | TNoteBody | null | undefined; newName: string } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                updateNodeName(payload.nodeId, payload.newName);

                // если id изменяемой ноды совпадает с id текущей заметки, то обновляем данные и в сторе
                if (state.saveDataInspect.currentNote && state.saveDataInspect.currentNote.id === payload.nodeId) {
                    const node = await getNodeById_noRoot(payload.nodeId);
                    return { node: node, newName: payload.newName };
                }

                // если id изменяемой папки совпадает с id текущей папки, то обновляем данные и в сторе
                if (state.saveDataInspect.currentFolder && state.saveDataInspect.currentFolder.id === payload.nodeId) {
                    const node = await getNodeById_noRoot(payload.nodeId);
                    return { node: node, newName: payload.newName };
                }
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    if (action.payload && action.payload.node && isDataTreeNote(action.payload.node)) {
                        action.payload.node.name = action.payload.newName;
                        state.currentNote = action.payload.node;
                        return;
                    }
                    if (action.payload && action.payload.node && isDataTreeFolder(action.payload.node)) {
                        action.payload.node.name = action.payload.newName;
                        state.currentFolder = nodeWithoutChildren(action.payload.node) as IDataTreeFolder;
                    }
                },
            }
        ),
    }),
});

export const {
    setCurrentFolder,
    setCurrentNote,
    updateNote,
    deleteCurrentNote_and_noteIndb,
    deleteCurrentFolder_and_folderIndb,
    deleteFolderInDb,
    deleteNoteInDb,
    renameNodeName,
} = saveDataInspectSlice.actions;
export const { reducer } = saveDataInspectSlice;
export { saveDataInspectSlice };
export type { ISaveDataInspectStore };
