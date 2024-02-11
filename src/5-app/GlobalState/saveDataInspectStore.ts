import type { IDataTreeNote, IDataTreeFolder, TchildrenType, TNoteBody, IDataTreeRootFolder, IGlobalTag } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { nodeWithoutChildren } from "2-features/utils/saveDataUtils";
import type { RootState } from "5-app/GlobalState/store";
import { getDataTreeDB } from "2-features/utils/appIndexedDB";
import { updateNodeValue, deleteById, deleteComponentInNote, updateNodeName, addNodeTo, nodeMuveTo, noteDeleteTag } from "2-features/utils/saveDataEdit";
import { getNodeById, getParentNode } from "2-features/utils/saveDataParse";
import { createAppSlice } from "./scliceCreator";
import { DataFolder } from "0-shared/utils/saveDataFolder";
import { DataNote } from "0-shared/utils/saveDataNote";

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
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const deletedNode = deleteById(dataTree, payload.nodeId);

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
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const updatedNote = deleteComponentInNote(dataTree, payload.noteId, payload.componentId);

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
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const updatedNode = updateNodeValue(dataTree, payload.noteId, payload.componentId, payload.newValue);

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
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const updatedNode = updateNodeName(dataTree, payload.nodeId, payload.newName);

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
        // добавление папки
        addFolder: create.asyncThunk<{ nodeName: string; insertToId: string; color?: string }, { addedNode: IDataTreeFolder | IDataTreeNote | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const newNode = new DataFolder(payload.nodeName, payload.color);
                const addedNode = await addNodeTo(dataTree, payload.insertToId, newNode);

                if (addedNode) {
                    return { addedNode: addedNode };
                }
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    if (!action.payload) return;
                },
            }
        ),
        // добавление заметки
        addNote: create.asyncThunk<
            { nodeName: string; insertToId: string; tags?: string[] },
            { addedNode: IDataTreeFolder | IDataTreeNote | TNoteBody; dataTree: IDataTreeRootFolder } | undefined
        >(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                let dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const newNode = new DataNote(payload.nodeName);
                const addedNode = await addNodeTo(dataTree, payload.insertToId, newNode);
                dataTree = await getDataTreeDB();

                if (addedNode && dataTree) {
                    return { addedNode, dataTree };
                }
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    if (!action.payload) return;
                    let {
                        payload: { addedNode, dataTree },
                    } = action;

                    if (isDataTreeNote(addedNode)) {
                        state.currentNote = addedNode;
                        let nodeParent = getParentNode(dataTree, addedNode.id);

                        if (isDataTreeFolder(nodeParent)) {
                            state.currentFolder = nodeWithoutChildren(nodeParent) as IDataTreeFolder;
                        }
                    }
                },
            }
        ),
        // перемещение папки или заметки в другую папку
        moveFolderOrNote: create.asyncThunk<{ muvedNodeID: string; muveToID: string }, { muvedNode: IDataTreeFolder | IDataTreeNote | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const muvedNode = await nodeMuveTo(dataTree, payload.muvedNodeID, payload.muveToID);

                if (muvedNode) {
                    return { muvedNode };
                }
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    if (!action.payload) return;
                },
            }
        ),
        // удаляет тег у заметки
        noteDelTag: create.asyncThunk<{ tag: IGlobalTag }, { editedNote: IDataTreeNote } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();
                const currentNote = state.saveDataInspect.currentNote;

                if (!currentNote || !dataTree) return;

                const editedNote = await noteDeleteTag(dataTree, currentNote.id, payload.tag);

                if (editedNote) {
                    return { editedNote };
                }
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    if (!action.payload) return;
                    let {
                        payload: { editedNote },
                    } = action;

                    state.currentNote = editedNote;
                },
            }
        ),
    }),
});

export const {
    setCurrentFolder,
    setCurrentNote,
    updateNoteComponentValue,
    deleteNoteOrFolder,
    renameNodeName,
    deleteNoteComponent,
    addFolder,
    addNote,
    moveFolderOrNote,
    noteDelTag,
} = saveDataInspectSlice.actions;
export const { reducer } = saveDataInspectSlice;
export { saveDataInspectSlice };
export type { ISaveDataInspectStore };
