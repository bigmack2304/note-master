import type { IDataTreeNote, IDataTreeFolder, TchildrenType, TNoteBody, IDataTreeRootFolder, IGlobalTag, TTagColors } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { nodeWithoutChildren } from "2-features/utils/saveDataUtils";
import type { RootState } from "5-app/GlobalState/store";
import { getDataTreeDB, getGlobalTagsDB } from "2-features/utils/appIndexedDB";
import {
    updateNodeValue,
    deleteById,
    deleteComponentInNote,
    updateNodeName,
    addNodeTo,
    nodeMuveTo,
    noteDeleteTag,
    noteAddTag as noteAdTag,
    projectAddTag,
    projectDeleteTag as projectDelTag,
} from "2-features/utils/saveDataEdit";
import { getNodeById, getParentNode } from "2-features/utils/saveDataParse";
import { createAppSlice } from "./scliceCreator";
import { DataFolder } from "0-shared/utils/saveDataFolder";
import { DataNote } from "0-shared/utils/saveDataNote";
import { DataTag } from "0-shared/utils/saveDataTag";

// взаимодействия с папками и заметками, и все нужные данные для этого

interface ISaveDataInspectStore {
    isProjectOpen: boolean;
    currentFolder: Omit<IDataTreeFolder, "children"> | undefined;
    currentNote: IDataTreeNote | undefined;
}

const initialState: ISaveDataInspectStore = {
    isProjectOpen: false,
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
        // устанавливаем состояние проекта (открыт или нет)
        setProjectOpen: create.reducer<ISaveDataInspectStore["isProjectOpen"]>((state, action) => {
            state.isProjectOpen = action.payload;
        }),
        // удалить папку или заметку из indexedDB
        deleteNoteOrFolder: create.asyncThunk<{ nodeId: string }, { deletedNode: TchildrenType } | undefined>(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const deletedNode = await deleteById(dataTree, payload.nodeId);

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

                const updatedNote = await deleteComponentInNote(dataTree, payload.noteId, payload.componentId);

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

                const updatedNode = await updateNodeValue(dataTree, payload.noteId, payload.componentId, payload.newValue);

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

                const updatedNode = await updateNodeName(dataTree, payload.nodeId, payload.newName);

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
            { nodeName: string; insertToId: string; tags: string[] | string },
            { addedNode: IDataTreeFolder | IDataTreeNote | TNoteBody; dataTree: IDataTreeRootFolder } | undefined
        >(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                let dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const newNode = new DataNote(payload.nodeName, payload.tags);
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
        //добавляет тег в заметку
        noteAddTag: create.asyncThunk<{ tag: string | string[] }, { editedNote: IDataTreeNote } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();
                const currentNote = state.saveDataInspect.currentNote;

                if (!currentNote || !dataTree) return;

                const editedNote = await noteAdTag(dataTree, currentNote.id, payload.tag);

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
        //добавляет новый тег в проект
        projectAddNewTag: create.asyncThunk<{ tagName: string; tagColor: TTagColors }, { addedTag: IGlobalTag } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const allTags = await getGlobalTagsDB();

                if (!allTags) return;

                for (let tag in allTags) {
                    // не должно быть тегов с одинаковыми названиями
                    if (allTags[tag].tag_name === payload.tagName) {
                        return;
                    }
                }

                const newTag = new DataTag(payload.tagName, payload.tagColor);
                const addedTag = await projectAddTag(allTags, newTag);

                if (addedTag) {
                    return { addedTag };
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
        //удаляет тег из всего проекта
        projectDeleteTag: create.asyncThunk<{ tagName: string }, { deletedTagName: string; curentNoteInDB: TchildrenType | TNoteBody | null } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const allTags = await getGlobalTagsDB();
                let dataTree = await getDataTreeDB();

                if (!allTags || !dataTree) return;

                const deletedTagName = await projectDelTag(allTags, dataTree, payload.tagName);

                let curentNoteInDB: ReturnType<typeof getNodeById> = null;

                // после удаляения тега, нужно обновить данниы в редаксе, потомучто в активной заметке мог быть удаляемый тег
                if (state.saveDataInspect.currentNote) {
                    dataTree = await getDataTreeDB();
                    curentNoteInDB = getNodeById(dataTree, state.saveDataInspect.currentNote.id);
                }

                return { deletedTagName, curentNoteInDB };
            },
            {
                pending: (state) => {},
                rejected: (state, action) => {},
                fulfilled: (state, action) => {
                    if (!action.payload || !action.payload.curentNoteInDB || !action.payload.deletedTagName) return;
                    const {
                        payload: { curentNoteInDB },
                    } = action;

                    if (state.currentNote && isDataTreeNote(curentNoteInDB)) {
                        state.currentNote = curentNoteInDB;
                    }
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
    noteAddTag,
    setProjectOpen,
    projectAddNewTag,
    projectDeleteTag,
} = saveDataInspectSlice.actions;
export const { reducer } = saveDataInspectSlice;
export { saveDataInspectSlice };
export type { ISaveDataInspectStore };
