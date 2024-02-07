import type { IDataTreeNote, IDataTreeFolder, TchildrenType, TNoteBody } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { nodeWithoutChildren } from "2-features/utils/saveDataUtils";
import type { RootState } from "5-app/GlobalState/store";
import { getTempDataDB } from "2-features/utils/appIndexedDB";
import { updateNodeValue, deleteById, deleteComponentInNote, updateNodeName } from "2-features/utils/saveDataEdit";
import { getNodeById } from "2-features/utils/saveDataParse";
import { createAppSlice } from "./scliceCreator";

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
        // удалить папку или заметку из indexedDB
        deleteNoteOrFolder: create.asyncThunk<{ nodeId: string }, { deletedNode: TchildrenType } | undefined>(
            async (payload, thunkApi) => {
                const datasSave = await getTempDataDB();

                if (!datasSave) return;

                const deletedNode = deleteById(datasSave, payload.nodeId);

                if (deletedNode) {
                    return { deletedNode: deletedNode };
                }
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    if (!action.payload || !action.payload.deletedNode) return;
                    let {
                        payload: { deletedNode },
                    } = action;

                    // если id удаляемой ноды совпадает с текущей активной заметкой то и ее удаляем
                    if (state.currentNote && state.currentNote.id === deletedNode.id && isDataTreeNote(deletedNode)) {
                        state.currentNote = undefined;
                        return;
                    }

                    // если id удаляемой ноды совпадает с текущей активной папкой то и ее удаляем
                    if (state.currentFolder && state.currentFolder.id === deletedNode.id && isDataTreeFolder(deletedNode)) {
                        state.currentFolder = undefined;
                        // если в нутри удаленной папки была активная заметка то ее удаляем из стора
                        if (state.currentNote && getNodeById(deletedNode, state.currentNote.id)) {
                            state.currentNote = undefined;
                        }
                    }
                },
            }
        ),
        // удалить компонент внутри заметки
        deleteNoteComponent: create.asyncThunk<{ noteId: string; componentId: string }, { updatedNote: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const datasSave = await getTempDataDB();

                if (!datasSave) return;

                const updatedNote = deleteComponentInNote(datasSave, payload.noteId, payload.componentId);

                if (updatedNote) {
                    return { updatedNote: updatedNote };
                }
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    // если id изменяемой ноды совпадает с id текущей заметки, то обновляем данные и в сторе
                    if (!action.payload || !action.payload.updatedNote) return;
                    let {
                        payload: { updatedNote },
                    } = action;
                    if (!state.currentNote || state.currentNote.id !== updatedNote.id || !isDataTreeNote(updatedNote)) return;

                    state.currentNote = updatedNote;
                },
            }
        ),
        // обновляем component.value в активной заметке и в indexedDB
        updateNoteComponentValue: create.asyncThunk<{ noteId: string; componentId: string; newValue: string }, { updatedNode: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const datasSave = await getTempDataDB();

                if (!datasSave) return;

                const updatedNode = updateNodeValue(datasSave, payload.noteId, payload.componentId, payload.newValue);

                if (updatedNode) {
                    return { updatedNode: updatedNode };
                }
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    // если id изменяемой ноды совпадает с id текущей заметки, то обновляем данные и в сторе
                    if (!action.payload || !action.payload.updatedNode) return;
                    let {
                        payload: { updatedNode },
                    } = action;
                    if (!state.currentNote || state.currentNote.id !== updatedNode.id || !isDataTreeNote(updatedNode)) return;

                    state.currentNote = updatedNode;
                },
            }
        ),
        // переименование ноды
        renameNodeName: create.asyncThunk<{ nodeId: string; newName: string }, { updatedNode: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const datasSave = await getTempDataDB();

                if (!datasSave) return;

                const updatedNode = updateNodeName(datasSave, payload.nodeId, payload.newName);

                if (updatedNode) {
                    return { updatedNode: updatedNode };
                }
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    if (!action.payload || !action.payload.updatedNode) return;
                    let {
                        payload: { updatedNode },
                    } = action;
                    // если id изменяемой ноды совпадает с id текущей заметки, то обновляем данные и в сторе
                    if (state.currentNote && state.currentNote.id === updatedNode.id && isDataTreeNote(updatedNode)) {
                        state.currentNote = updatedNode;
                        return;
                    }

                    // если id изменяемой ноды совпадает с id текущей папки, то обновляем данные и в сторе
                    if (state.currentFolder && state.currentFolder.id === updatedNode.id && isDataTreeFolder(updatedNode)) {
                        state.currentFolder = nodeWithoutChildren(updatedNode) as IDataTreeFolder;
                    }
                },
            }
        ),
    }),
});

export const { setCurrentFolder, setCurrentNote, updateNoteComponentValue, deleteNoteOrFolder, renameNodeName, deleteNoteComponent } = saveDataInspectSlice.actions;
export const { reducer } = saveDataInspectSlice;
export { saveDataInspectSlice };
export type { ISaveDataInspectStore };
