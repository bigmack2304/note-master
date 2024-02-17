import type { IDataTreeNote, IDataTreeFolder, TchildrenType, TNoteBody, IDataTreeRootFolder, IGlobalTag, TTagColors, TAllComponents } from "0-shared/types/dataSave";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { nodeWithoutChildren } from "2-features/utils/saveDataUtils";
import type { RootState } from "5-app/GlobalState/store";
import { getDataTreeDB, getGlobalTagsDB, loadTempDataInSavedData } from "2-features/utils/appIndexedDB";
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
    projectEditeTag,
    updateNodeCompleted,
    addNewComponentToNote,
} from "2-features/utils/saveDataEdit";
import { getNodeById, getParentNode, getAllIds } from "2-features/utils/saveDataParse";
import { createAppSlice } from "./scliceCreator";
import { DataFolder } from "0-shared/utils/saveDataFolder";
import { DataNote } from "0-shared/utils/saveDataNote";
import { DataTag } from "0-shared/utils/saveDataTag";
import { IdGenerator, savedIdGenerator } from "0-shared/utils/idGenerator";
import { DataProject } from "0-shared/utils/saveDataProject";
import { setAllTempDataDB, saveTempData } from "2-features/utils/appIndexedDB";
import { EV_NAME_SAVE_DATA_REDUCER_END, EV_NAME_SAVE_DATA_REDUCER_FULFILLED, EV_NAME_SAVE_DATA_REDUCER_REJECT, EV_NAME_SAVE_DATA_REDUCER_START } from "5-app/settings";

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
        // создаем новый проект
        createNewProject: create.reducer((state, action) => {
            state.currentFolder = undefined;
            state.currentNote = undefined;
            state.isProjectOpen = true;
            const newProj = new DataProject();
            savedIdGenerator.instatnceIdGenerator = new IdGenerator(getAllIds(newProj));
            setAllTempDataDB({ value: newProj });
        }),
        // сохраняем проект в db
        saveProjectInDb: create.asyncThunk<undefined, { resultBool: boolean } | undefined>(
            async (payload, thunkApi) => {
                const resultBool = await saveTempData();

                if (!resultBool) {
                    throw new Error();
                }

                return { resultBool };
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
            }
        ),
        // открываем проект из db
        loadProjectInDb: create.asyncThunk<undefined, { resultBool: boolean } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;

                const { resultBool, data } = await loadTempDataInSavedData();

                if (!resultBool || !data) {
                    throw new Error();
                }

                savedIdGenerator.instatnceIdGenerator = new IdGenerator(getAllIds(data));
                await setAllTempDataDB({ value: data });

                return { resultBool };
            },
            {
                pending: (state) => {
                    state.isProjectOpen = false;
                    state.currentNote = undefined;
                    state.currentFolder = undefined;
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    state.isProjectOpen = true;
                },
            }
        ),
        // удалить папку или заметку из indexedDB
        // валидация: такая нода должна сузествовать и она не должна быть root
        deleteNoteOrFolder: create.asyncThunk<{ nodeId: string }, { deletedNode: TchildrenType } | undefined>(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const { deletedNode, resultBool } = await deleteById(dataTree, payload.nodeId);

                if (!resultBool) {
                    throw new Error();
                }

                if (deletedNode) {
                    return { deletedNode: deletedNode };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
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
        // валидация: такой компонент и заметка должны существовать
        deleteNoteComponent: create.asyncThunk<{ noteId: string; componentId: string }, { updatedNote: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const { targetNote: updatedNote, resultBool } = await deleteComponentInNote(dataTree, payload.noteId, payload.componentId);

                if (!resultBool) {
                    throw new Error();
                }

                if (updatedNote) {
                    return { updatedNote: updatedNote };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
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
        // валидация: такой компонент и заметка должны существовать
        updateNoteComponentValue: create.asyncThunk<{ noteId: string; componentId: string; newValue: string }, { updatedNode: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const { targetNote: updatedNode, resultBool } = await updateNodeValue(dataTree, payload.noteId, payload.componentId, payload.newValue);

                if (!resultBool) {
                    throw new Error();
                }

                if (updatedNode) {
                    return { updatedNode: updatedNode };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
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
        // обновляем note.completed в активной заметке и в indexedDB
        updateNoteCompleted: create.asyncThunk<{ noteId: string; newCompleted: boolean }, { updatedNode: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const { targetNote: updatedNode, resultBool } = await updateNodeCompleted(dataTree, payload.noteId, payload.newCompleted);

                if (!resultBool) {
                    throw new Error();
                }

                if (updatedNode) {
                    return { updatedNode: updatedNode };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
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
        // валидация: такая нода должна существовать
        renameNodeName: create.asyncThunk<{ nodeId: string; newName: string }, { updatedNode: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const { targetNode: updatedNode, resultBool } = await updateNodeName(dataTree, payload.nodeId, payload.newName);

                if (!resultBool) {
                    throw new Error();
                }

                if (updatedNode) {
                    return { updatedNode: updatedNode };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
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
        // валидация: папку можно добавить только в папку
        addFolder: create.asyncThunk<{ nodeName: string; insertToId: string; color?: string }, { addedNode: IDataTreeFolder | IDataTreeNote | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const newNode = new DataFolder(payload.nodeName, payload.color);
                const { newNode: addedNode, resultBool } = await addNodeTo(dataTree, payload.insertToId, newNode);

                if (!resultBool) {
                    throw new Error();
                }

                if (addedNode) {
                    return { addedNode: addedNode };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    if (!action.payload) return;
                },
            }
        ),
        // добавление заметки
        // валидация: заметку можно добавить только в папку
        addNote: create.asyncThunk<
            { nodeName: string; insertToId: string; tags: string[] | string },
            { addedNode: IDataTreeFolder | IDataTreeNote | TNoteBody; dataTree: IDataTreeRootFolder } | undefined
        >(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                let dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const newNode = new DataNote(payload.nodeName, payload.tags);
                const { newNode: addedNode, resultBool } = await addNodeTo(dataTree, payload.insertToId, newNode);

                if (!resultBool) {
                    throw new Error();
                }

                dataTree = await getDataTreeDB();

                if (addedNode && dataTree) {
                    return { addedNode, dataTree };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
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
        // валидация: короче папки и ноды должны существовать, root нельзя перемещать и папку саму в себя нельзя перемещать
        moveFolderOrNote: create.asyncThunk<{ muvedNodeID: string; muveToID: string }, { muvedNode: IDataTreeFolder | IDataTreeNote | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const { muvedNode, resultBool } = await nodeMuveTo(dataTree, payload.muvedNodeID, payload.muveToID);

                if (!resultBool) {
                    throw new Error();
                }

                if (muvedNode) {
                    return { muvedNode };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    if (!action.payload) return;
                },
            }
        ),
        // удаляет тег у заметки
        // валидация: заметка должна существовать и тег в ней должен существовать
        noteDelTag: create.asyncThunk<{ tag: IGlobalTag }, { editedNote: IDataTreeNote } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();
                const currentNote = state.saveDataInspect.currentNote;

                if (!currentNote || !dataTree) return;

                const { targetNote: editedNote, resultBool } = await noteDeleteTag(dataTree, currentNote.id, payload.tag);

                if (!resultBool) {
                    throw new Error();
                }

                if (editedNote) {
                    return { editedNote };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    if (!action.payload) return;
                    let {
                        payload: { editedNote },
                    } = action;

                    state.currentNote = editedNote;
                },
            }
        ),
        //добавляет тег в заметку
        //валидация: если есть какието проблемы с currentNote или имя тега неверное то ошибка
        noteAddTag: create.asyncThunk<{ tag: string | string[] }, { editedNote: IDataTreeNote } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();
                const currentNote = state.saveDataInspect.currentNote;

                if (!currentNote || !dataTree) return;

                const { targetNote: editedNote, resultBool } = await noteAdTag(dataTree, currentNote.id, payload.tag);

                if (!resultBool) {
                    throw new Error();
                }

                if (editedNote) {
                    return { editedNote };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    if (!action.payload) return;
                    let {
                        payload: { editedNote },
                    } = action;

                    state.currentNote = editedNote;
                },
            }
        ),
        //добавляет новый тег в проект
        //валидация: нельзя добавить тег, если тег с таким имянем уже существует
        projectAddNewTag: create.asyncThunk<{ tagName: string; tagColor: TTagColors }, { addedTag: IGlobalTag } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const allTags = await getGlobalTagsDB();

                if (!allTags) return;

                // не должно быть тегов с одинаковыми названиями
                if (payload.tagName in allTags) {
                    throw new Error();
                }

                const newTag = new DataTag(payload.tagName, payload.tagColor);
                const addedTag = await projectAddTag(allTags, newTag);

                if (addedTag) {
                    return { addedTag };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    if (!action.payload) return;
                },
            }
        ),
        //удаляет тег из всего проекта
        //валидация: если такого тега в проекте небыло то и нечего удалять
        projectDeleteTag: create.asyncThunk<{ tagName: string }, { deletedTagName: string; curentNoteInDB: TchildrenType | TNoteBody | null } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const allTags = await getGlobalTagsDB();
                let dataTree = await getDataTreeDB();

                if (!allTags || !dataTree) return;

                const { tagName: deletedTagName, resultBool } = await projectDelTag(allTags, dataTree, payload.tagName);

                if (!resultBool) {
                    throw new Error();
                }

                let curentNoteInDB: ReturnType<typeof getNodeById> = null;

                // после удаляения тега, нужно обновить данниы в редаксе, потомучто в активной заметке мог быть удаляемый тег
                if (state.saveDataInspect.currentNote) {
                    dataTree = await getDataTreeDB();
                    curentNoteInDB = getNodeById(dataTree, state.saveDataInspect.currentNote.id);
                }

                return { deletedTagName, curentNoteInDB };
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
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
        //изменяет тег во всем проекте
        //валидация: если имя тега изменилось то оно применится только если в проекте нет другово тега с такимже имянем
        projectEditTag: create.asyncThunk<
            { newTagName: string; newTagColor: TTagColors; oldTagName: string },
            { editedTagName: string; curentNoteInDB: TchildrenType | TNoteBody | null } | undefined
        >(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const allTags = await getGlobalTagsDB();
                let dataTree = await getDataTreeDB();

                if (!allTags || !dataTree) return;

                const { newTagName: editedTagName, resultBool } = await projectEditeTag(allTags, dataTree, payload.oldTagName, payload.newTagName, payload.newTagColor);

                let curentNoteInDB: ReturnType<typeof getNodeById> = null;

                if (!resultBool) {
                    throw new Error();
                }

                // после изменения тега, нужно обновить данниые в редаксе, потомучто в активной заметке мог быть удаляемый тег
                if (state.saveDataInspect.currentNote) {
                    dataTree = await getDataTreeDB();
                    curentNoteInDB = getNodeById(dataTree, state.saveDataInspect.currentNote.id);
                }

                return { editedTagName, curentNoteInDB };
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    if (!action.payload || !action.payload.curentNoteInDB || !action.payload.editedTagName) return;
                    const {
                        payload: { curentNoteInDB },
                    } = action;

                    if (state.currentNote && isDataTreeNote(curentNoteInDB)) {
                        state.currentNote = curentNoteInDB;
                    }
                },
            }
        ),

        // добавляет новый компонент в заметку
        // валидация: такой компонент и заметка должны существовать
        addNewComponentInNote: create.asyncThunk<{ noteId: string; componentType: TAllComponents }, { updatedNote: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();

                if (!dataTree) return;

                const { updatedNote, resultBool } = await addNewComponentToNote(dataTree, payload.noteId, payload.componentType);

                if (!resultBool) {
                    throw new Error();
                }

                if (updatedNote) {
                    return { updatedNote };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
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
    projectEditTag,
    createNewProject,
    saveProjectInDb,
    loadProjectInDb,
    updateNoteCompleted,
    addNewComponentInNote,
} = saveDataInspectSlice.actions;
export const { reducer } = saveDataInspectSlice;
export { saveDataInspectSlice };
export type { ISaveDataInspectStore };
