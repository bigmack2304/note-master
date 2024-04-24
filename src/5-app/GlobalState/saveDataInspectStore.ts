import { projectAddTag, addNewComponentToNote } from "2-features/utils/saveDataEdit";
import {
    EV_NAME_SAVE_DATA_REDUCER_END,
    EV_NAME_SAVE_DATA_REDUCER_FULFILLED,
    EV_NAME_SAVE_DATA_REDUCER_REJECT,
    EV_NAME_SAVE_DATA_REDUCER_START,
    EV_NAME_LINK_NOTE_REDIRECT,
} from "5-app/settings";
import { runTaskOnWorker } from "0-shared/dedicatedWorker/workerFuncs";
import { workerRef } from "0-shared/dedicatedWorker/workerInit";
import { isDataTreeFolder, isDataTreeNote } from "0-shared/utils/typeHelpers";
import { nodeWithoutChildren, saveDataAsFile } from "2-features/utils/saveDataUtils";
import { log } from "0-shared/utils/reducer_log";
import { loadTempDataInSavedData, getUnitedTempData } from "2-features/utils/appIndexedDB";
import { getGlobalTagsDB } from "2-features/utils/appIndexedDBFynctions/globalTagsFunctions";
import { getDataTreeDB } from "2-features/utils/appIndexedDBFynctions/dataTreeDb";
import { getAllIds } from "2-features/utils/saveDataParse";
import { getParentNode } from "2-features/utils/saveDataParseFunctions/getParentNode";
import { getNodeById } from "2-features/utils/saveDataParseFunctions/getNodeById";
import { createAppSlice } from "./scliceCreator";
import { DataFolder } from "0-shared/utils/classes/saveDataFolder";
import { DataNote } from "0-shared/utils/classes/saveDataNote";
import { DataTag } from "0-shared/utils/classes/saveDataTag";
import { IdGenerator, savedIdGenerator } from "0-shared/utils/idGenerator";
import { DataProject } from "0-shared/utils/classes/saveDataProject";
import { setAllTempDataDB, saveTempData } from "2-features/utils/appIndexedDB";
import type {
    IDataTreeNote,
    IDataTreeFolder,
    TchildrenType,
    TNoteBody,
    IDataTreeRootFolder,
    IGlobalTag,
    TTagColors,
    TAllComponents,
    TBodyComponentText,
    TBodyComponentHeader,
    TBodyComponentCode,
    TBodyComponentLink,
    TBodyComponentList,
    TBodyComponentTable,
    TTableValue,
} from "0-shared/types/dataSave";
import type { TRadioData } from "2-features/components/NoteSelector/NoteSelector";
import type { RootState } from "5-app/GlobalState/store";
import type {
    TMessageUpdateNoteComponentImageSettingsOnWorker,
    TMessageDelById,
    TMessageDelCompInNote,
    TMessageUpdateNodeValueOnWorker,
    TMessageUpdateNodeImageOnWorker,
    TMessageUpdNoteComponentsOrderOnWorker,
    TMessageUpdateNodeTableOnWorker,
    TMessageUpdateNodeTableSettingsOnWorker,
    TMessageUpdateNodeLinkOnWorker,
    TMessageGetNodeByIdOnWorker,
    TMessageUpdateNoteComponentLinkSettingsOnWorker,
    TMessageUpdateNoteComponentTextSettingsOnWorker,
    TMessageUpdateNoteComponentListSettingsOnWorker,
    TMessageUpdateNoteComponentHeaderSettingsOnWorker,
    TMessageUpdateNoteComponentCodeSettingsOnWorker,
    TMessageUpdateNodeCompletedOnWorker,
    TMessageUpdateNodeNameOnWorker,
    TMessageAddNodeToOnWorker,
    TMessageNodeMuveToOnWorker,
    TMessageNoteDeleteTagOnWorker,
    TMessageNoteAddTagOnWorker,
    TMessageProjectDeleteTagOnWorker,
    TMessageGetParentNodeOnWorker,
    TMessageProjectEditeTagOnWorker,
} from "0-shared/dedicatedWorker/workerTypes";
import type { TReturnTypeUpdateNoteComponentImageSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentImageSettings";
import type { TReturnTypeDeleteById } from "2-features/utils/saveDataEditFunctions/deleteById";
import { TReturnTypeDeleteComponentInNote } from "2-features/utils/saveDataEditFunctions/deleteComponentInNote";
import type { TReturnTypeUpdateNodeValue } from "2-features/utils/saveDataEditFunctions/updateNoteValue";
import type { TReturnTypeUpdNoteComponentsOrder } from "2-features/utils/saveDataEditFunctions/updNoteComponentsOrder";
import type { TReturnTypeUpdateNodeImage } from "2-features/utils/saveDataEditFunctions/updateNoteImage";
import type { TReturnTypeUpdateNodeTable } from "2-features/utils/saveDataEditFunctions/updateNodeTable";
import type { TReturnTypeUpdateNodeTableSettings } from "2-features/utils/saveDataEditFunctions/updateNodeTableSettings";
import type { TReturnTypeUpdateNodeLink } from "2-features/utils/saveDataEditFunctions/updateNodeLink";
import type { TReturnTypeGetNodeById } from "2-features/utils/saveDataParseFunctions/getNodeById";
import type { TReturnTypeUpdateNoteComponentLinkSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentLinkSettings";
import type { TReturnTypeUpdateNoteComponentTextSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentTextSettings";
import type { TReturnTypeUpdateNoteComponentListSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentListSettings";
import type { TReturnTypeUpdateNoteComponentHeaderSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentHeaderSettings";
import type { TReturnTypeUpdateNoteComponentCodeSettings } from "2-features/utils/saveDataEditFunctions/componentCodeSettings";
import type { TReturnTypeUpdateNodeCompleted } from "2-features/utils/saveDataEditFunctions/updateNodeCompleted";
import type { TReturnTypeUpdateNodeName } from "2-features/utils/saveDataEditFunctions/updateNodeName";
import type { TReturnTypeAddNodeTo } from "2-features/utils/saveDataEditFunctions/addNodeTo";
import type { TReturnTypeNodeMuveTo } from "2-features/utils/saveDataEditFunctions/nodeMuveTo";
import type { TReturnTypeNoteDeleteTag } from "2-features/utils/saveDataEditFunctions/noteDeleteTag";
import type { TReturnTypeNoteAddTag } from "2-features/utils/saveDataEditFunctions/noteAddTag";
import type { TReturnTypeProjectDeleteTag } from "2-features/utils/saveDataEditFunctions/projectDeleteTag";
import type { TReturnTypeGetParentNode } from "2-features/utils/saveDataParseFunctions/getParentNode";
import { TReturnTypeProjectEditeTag } from "2-features/utils/saveDataEditFunctions/projectEditeTag";

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
        setCurrentFolder: create.reducer<IDataTreeFolder | undefined>((state, action) => {
            let prepareFolder = action.payload;
            if (prepareFolder && "children" in prepareFolder) {
                prepareFolder = nodeWithoutChildren(prepareFolder as IDataTreeFolder) as IDataTreeFolder;
            }
            state.currentFolder = prepareFolder;
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
                    log(action);
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
                    log(action);
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    state.isProjectOpen = true;
                },
            }
        ),
        // удалить папку или заметку из indexedDB
        deleteNoteOrFolder: create.asyncThunk<{ nodeId: string }, { deletedNode: TchildrenType } | undefined>(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;
                if (!savedIdGenerator.instatnceIdGenerator) return;

                const { deletedNode, resultBool, newIdGenerator } = await runTaskOnWorker<TMessageDelById, TReturnTypeDeleteById>(worker, {
                    rootNode: dataTree,
                    savedIdGenerator: savedIdGenerator.instatnceIdGenerator.getIdsArray(),
                    target_id: payload.nodeId,
                    type: "delete by id",
                });

                savedIdGenerator.instatnceIdGenerator = new IdGenerator(new Set(newIdGenerator));

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
                    log(action);
                },
                fulfilled: (state, action) => {
                    const handler = async () => {
                        const worker = workerRef.DWorker;
                        window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                        window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                        if (!action.payload || !action.payload.deletedNode) return;
                        if (!worker) return;

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
                            if (
                                state.currentNote &&
                                (await runTaskOnWorker<TMessageGetNodeByIdOnWorker, TReturnTypeGetNodeById>(worker, {
                                    args: [deletedNode, state.currentNote.id],
                                    type: "get node by id",
                                }))
                            ) {
                                state.currentNote = undefined;
                            }
                        }
                    };

                    handler();
                },
            }
        ),
        // удалить компонент внутри заметки
        deleteNoteComponent: create.asyncThunk<
            { noteId: string; componentId: string },
            { updatedNote: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;
                if (!savedIdGenerator.instatnceIdGenerator) return;

                const {
                    targetNote: updatedNote,
                    resultBool,
                    newIdGenerator,
                } = await runTaskOnWorker<TMessageDelCompInNote, TReturnTypeDeleteComponentInNote>(worker, {
                    componentID: payload.componentId,
                    noteID: payload.noteId,
                    rootFolder: dataTree,
                    savedIdGenerator: savedIdGenerator.instatnceIdGenerator.getIdsArray(),
                    type: "delete component in note",
                });

                savedIdGenerator.instatnceIdGenerator = new IdGenerator(new Set(newIdGenerator));

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
                    log(action);
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
        updateNoteComponentValue: create.asyncThunk<
            { noteId: string; componentId: string; newValue: string },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!worker) return;
                if (!dataTree) return;

                const { targetNote: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNodeValueOnWorker,
                    TReturnTypeUpdateNodeValue
                >(worker, {
                    componentId: payload.componentId,
                    newValue: payload.newValue,
                    noteId: payload.noteId,
                    rootFolder: dataTree,
                    type: "update node value",
                });

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
                    log(action);
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
        // меняет порядок компонентов в заметке
        updateNoteComponentsOrder: create.asyncThunk<
            { noteId: string; componentDragId: string; toComponentDragId: string },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdNoteComponentsOrderOnWorker,
                    TReturnTypeUpdNoteComponentsOrder
                >(worker, {
                    componentDragId: payload.componentDragId,
                    noteId: payload.noteId,
                    rootFolder: dataTree,
                    toComponentDragId: payload.toComponentDragId,
                    type: "update note components order",
                });

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
                    log(action);
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    // если id изменяемой ноды совпадает с id текущей заметки, то обновляем данные и в сторе
                    if (!action.payload || !action.payload.updatedNode) return;
                    let {
                        payload: { updatedNode },
                    } = action;
                    if (!isDataTreeNote(updatedNode)) return;

                    state.currentNote = updatedNode;
                },
            }
        ),
        // обновляем image в активной заметке и в indexedDB
        updateNoteComponentImage: create.asyncThunk<
            { noteId: string; componentId: string; newSrc: string; newName: string },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNodeImageOnWorker,
                    TReturnTypeUpdateNodeImage
                >(worker, {
                    componentId: payload.componentId,
                    newName: payload.newName,
                    newSrc: payload.newSrc,
                    noteId: payload.noteId,
                    rootFolder: dataTree,
                    type: "update node image",
                });

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
                    log(action);
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
        // обновляем table в активной заметке и в indexedDB
        updateNoteComponentTableDbData: create.asyncThunk<
            { noteId: string; componentId: string; newValue: "" | TTableValue },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNodeTableOnWorker,
                    TReturnTypeUpdateNodeTable
                >(worker, {
                    type: "update node table",
                    componentId: payload.componentId,
                    newValue: payload.newValue,
                    noteId: payload.noteId,
                    rootFolder: dataTree,
                });

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
                    log(action);
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
        // обновляем настройки table в активной заметке и в indexedDB
        updateNoteComponentTableDbSettings: create.asyncThunk<
            {
                noteId: string;
                componentId: string;
                backlight: TBodyComponentTable["backlight"];
                desc: TBodyComponentTable["desc"];
                viewButtons: TBodyComponentTable["viewButtons"];
                aligin: TBodyComponentTable["aligin"];
            },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNodeTableSettingsOnWorker,
                    TReturnTypeUpdateNodeTableSettings
                >(worker, {
                    rootFolder: dataTree,
                    aligin: payload.aligin,
                    backlight: payload.backlight,
                    componentId: payload.componentId,
                    desc: payload.desc,
                    noteId: payload.noteId,
                    type: "update node table settings",
                    viewButtons: payload.viewButtons,
                });

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
                    log(action);
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
        // обновляем link в активной заметке и в indexedDB
        updateNoteComponentLink: create.asyncThunk<
            { noteId: string; componentId: string; target: TBodyComponentLink["target"]; value: TBodyComponentLink["value"] },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNodeLinkOnWorker,
                    TReturnTypeUpdateNodeLink
                >(worker, {
                    componentId: payload.componentId,
                    noteId: payload.noteId,
                    rootFolder: dataTree,
                    target: payload.target,
                    type: "update node link",
                    value: payload.value,
                });

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
                    log(action);
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
        // переход по компеоненту link в активной заметке и в indexedDB
        redirectNoteComponentLink: create.asyncThunk<{ url: TRadioData }, { targetNote: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const targetNote = await runTaskOnWorker<TMessageGetNodeByIdOnWorker, TReturnTypeGetNodeById>(worker, {
                    args: [dataTree, payload.url.id],
                    type: "get node by id",
                });

                if (targetNote) {
                    return { targetNote };
                } else {
                    throw new Error();
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    log(action);
                },
                fulfilled: (state, action) => {
                    // window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    // если id изменяемой ноды совпадает с id текущей заметки, то обновляем данные и в сторе
                    if (!action.payload || !action.payload.targetNote) return;
                    let {
                        payload: { targetNote },
                    } = action;
                    if (!state.currentNote || state.currentNote.id === targetNote.id || !isDataTreeNote(targetNote)) return;

                    window.dispatchEvent(new CustomEvent<{ id: string }>(EV_NAME_LINK_NOTE_REDIRECT, { detail: { id: targetNote.id } }));
                    state.currentNote = targetNote;
                },
            }
        ),
        // обновляем настройки link в активной заметке и в indexedDB
        updateNoteComponentLinkSettings: create.asyncThunk<
            {
                noteId: string;
                componentId: string;
                isLabel: TBodyComponentLink["isLabel"];
                isBg: TBodyComponentLink["background"];
                labelVal: TBodyComponentLink["labelValue"];
            },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNoteComponentLinkSettingsOnWorker,
                    TReturnTypeUpdateNoteComponentLinkSettings
                >(worker, {
                    rootFolder: dataTree,
                    noteId: payload.noteId,
                    componentId: payload.componentId,
                    isLabel: payload.isLabel,
                    isBg: payload.isBg,
                    labelVal: payload.labelVal,
                    type: "update Note component link settings",
                });

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
                    log(action);
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
        // обновляем настройки image в активной заметке и в indexedDB
        updateNoteComponentImageSettings: create.asyncThunk<
            { noteId: string; componentId: string; imageDesc: string; isDescHidden: boolean },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNoteComponentImageSettingsOnWorker,
                    TReturnTypeUpdateNoteComponentImageSettings
                >(worker, {
                    rootFolder: dataTree,
                    componentId: payload.componentId,
                    noteId: payload.noteId,
                    imageDesc: payload.imageDesc,
                    isDescHidden: payload.isDescHidden,
                    type: "update note component image settings",
                });

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
                    log(action);
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
        // обновляет настройки компонента текста внутри заметки
        updateNoteComponentTextSettings: create.asyncThunk<
            {
                noteId: string;
                componentId: string;
                textBackground: boolean;
                textFormat: boolean;
                fontValue: TBodyComponentText["font"];
                lineBreak: boolean;
            },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNote, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNoteComponentTextSettingsOnWorker,
                    TReturnTypeUpdateNoteComponentTextSettings
                >(worker, {
                    rootFolder: dataTree,
                    noteId: payload.noteId,
                    componentId: payload.componentId,
                    textBackground: payload.textBackground,
                    textFormat: payload.textFormat,
                    fontValue: payload.fontValue,
                    lineBreak: payload.lineBreak,
                    type: "update note component text settings",
                });

                if (!resultBool) {
                    throw new Error();
                }

                if (updatedNote) {
                    return { updatedNode: updatedNote };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    log(action);
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
        // обновляет настройки компонента списка внутри заметки
        updateNoteComponentListSettings: create.asyncThunk<
            {
                noteId: string;
                componentId: string;
                listBg: TBodyComponentList["background"];
                isNumeric: TBodyComponentList["isNumeric"];
                aligin: TBodyComponentList["textAligin"];
            },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNote, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNoteComponentListSettingsOnWorker,
                    TReturnTypeUpdateNoteComponentListSettings
                >(worker, {
                    rootFolder: dataTree,
                    noteId: payload.noteId,
                    componentId: payload.componentId,
                    listBg: payload.listBg,
                    isNumeric: payload.isNumeric,
                    aligin: payload.aligin,
                    type: "update note component list settings",
                });

                if (!resultBool) {
                    throw new Error();
                }

                if (updatedNote) {
                    return { updatedNode: updatedNote };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    log(action);
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
        // обновляет настройки компонента заголовка внутри заметки
        updateNoteComponentHeaderSettings: create.asyncThunk<
            {
                noteId: string;
                componentId: string;
                textAligin: TBodyComponentHeader["textAligin"];
                headerSize: TBodyComponentHeader["headerSize"];
            },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNote, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNoteComponentHeaderSettingsOnWorker,
                    TReturnTypeUpdateNoteComponentHeaderSettings
                >(worker, {
                    rootFolder: dataTree,
                    noteId: payload.noteId,
                    componentId: payload.componentId,
                    headerSize: payload.headerSize,
                    textAligin: payload.textAligin,
                    type: "update note component header settings",
                });

                if (!resultBool) {
                    throw new Error();
                }

                if (updatedNote) {
                    return { updatedNode: updatedNote };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    log(action);
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
        // обновляет настройки компонента кода внутри заметки
        updateNoteComponentCodeSettings: create.asyncThunk<
            {
                noteId: string;
                componentId: string;
                codeTheme: TBodyComponentCode["codeTheme"];
                codeLanguage: TBodyComponentCode["language"];
                isExpand: TBodyComponentCode["isExpand"];
                expandDesc: TBodyComponentCode["expandDesc"];
            },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNote, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNoteComponentCodeSettingsOnWorker,
                    TReturnTypeUpdateNoteComponentCodeSettings
                >(worker, {
                    rootFolder: dataTree,
                    noteId: payload.noteId,
                    componentId: payload.componentId,
                    codeTheme: payload.codeTheme,
                    codeLanguage: payload.codeLanguage,
                    isExpand: payload.isExpand,
                    expandDesc: payload.expandDesc,
                    type: "update note component code settings",
                });

                if (!resultBool) {
                    throw new Error();
                }

                if (updatedNote) {
                    return { updatedNode: updatedNote };
                }
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    log(action);
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
        // скачивание проекта
        exportTempDataSave: create.asyncThunk<{ saveAs: string }>(
            async (payload, thunkApi) => {
                const allTempData = await getUnitedTempData();
                if (!allTempData) return;

                saveDataAsFile(payload.saveAs, allTempData);
            },
            {
                pending: (state) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_START));
                },
                rejected: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_REJECT));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    log(action);
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                },
            }
        ),
        // обновляем note.completed в активной заметке и в indexedDB
        updateNoteCompleted: create.asyncThunk<
            { noteId: string; newCompleted: boolean },
            { updatedNode: TchildrenType | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNote: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNodeCompletedOnWorker,
                    TReturnTypeUpdateNodeCompleted
                >(worker, { rootFolder: dataTree, noteId: payload.noteId, newValue: payload.newCompleted, type: "update node completed" });

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
                    log(action);
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
        renameNodeName: create.asyncThunk<{ nodeId: string; newName: string }, { updatedNode: TchildrenType | TNoteBody } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { targetNode: updatedNode, resultBool } = await runTaskOnWorker<
                    TMessageUpdateNodeNameOnWorker,
                    TReturnTypeUpdateNodeName
                >(worker, { rootFolder: dataTree, target_id: payload.nodeId, newName: payload.newName, type: "update node name" });

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
                    log(action);
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
        addFolder: create.asyncThunk<
            { nodeName: string; insertToId: string; color?: string },
            { addedNode: IDataTreeFolder | IDataTreeNote | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const newNode = new DataFolder(payload.nodeName, payload.color);
                const { newNode: addedNode, resultBool } = await runTaskOnWorker<TMessageAddNodeToOnWorker, TReturnTypeAddNodeTo>(worker, {
                    rootFolder: dataTree,
                    insertToId: payload.insertToId,
                    newNode: newNode,
                    type: "add node to",
                });

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
                    log(action);
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
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
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const newNode = new DataNote(payload.nodeName, payload.tags);
                const { newNode: addedNode, resultBool } = await runTaskOnWorker<TMessageAddNodeToOnWorker, TReturnTypeAddNodeTo>(worker, {
                    rootFolder: dataTree,
                    insertToId: payload.insertToId,
                    newNode: newNode,
                    type: "add node to",
                });

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
                    log(action);
                },
                fulfilled: (state, action) => {
                    const handler = async () => {
                        window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                        window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                        const worker = workerRef.DWorker;

                        if (!action.payload) return;
                        if (!worker) return;
                        let {
                            payload: { addedNode, dataTree },
                        } = action;

                        if (isDataTreeNote(addedNode)) {
                            state.currentNote = addedNode;
                            window.dispatchEvent(
                                new CustomEvent<{ id: string }>(EV_NAME_LINK_NOTE_REDIRECT, { detail: { id: addedNode.id } })
                            ); // делает эту заметку активной в блоке навигации

                            let nodeParent = runTaskOnWorker<TMessageGetParentNodeOnWorker, TReturnTypeGetParentNode>(worker, {
                                args: [dataTree, addedNode.id],
                                type: "get parent node",
                            });

                            if (isDataTreeFolder(nodeParent)) {
                                state.currentFolder = nodeWithoutChildren(nodeParent) as IDataTreeFolder;
                            }
                        }
                    };
                    handler();
                },
            }
        ),
        // перемещение папки или заметки в другую папку
        moveFolderOrNote: create.asyncThunk<
            { muvedNodeID: string; muveToID: string },
            { muvedNode: IDataTreeFolder | IDataTreeNote | TNoteBody } | undefined
        >(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!dataTree) return;
                if (!worker) return;

                const { muvedNode, resultBool } = await runTaskOnWorker<TMessageNodeMuveToOnWorker, TReturnTypeNodeMuveTo>(worker, {
                    rootFolder: dataTree,
                    muvedNodeID: payload.muvedNodeID,
                    muveToID: payload.muveToID,
                    type: "node move to",
                });

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
                    log(action);
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    if (!action.payload) return;
                },
            }
        ),
        // удаляет тег у заметки
        noteDelTag: create.asyncThunk<{ tag: IGlobalTag }, { editedNote: IDataTreeNote } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();
                const currentNoteID = state.saveDataInspect.currentNote?.id as string | undefined;
                const worker = workerRef.DWorker;

                if (!currentNoteID || !dataTree) return;
                if (!worker) return;

                const { targetNote: editedNote, resultBool } = await runTaskOnWorker<
                    TMessageNoteDeleteTagOnWorker,
                    TReturnTypeNoteDeleteTag
                >(worker, { rootFolder: dataTree, targetNoteID: currentNoteID, tag: payload.tag, type: "note delete tag" });

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
                    log(action);
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
        noteAddTag: create.asyncThunk<{ tag: string | string[] }, { editedNote: IDataTreeNote } | undefined>(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const dataTree = await getDataTreeDB();
                const currentNote = state.saveDataInspect.currentNote as IDataTreeNote | undefined;
                const worker = workerRef.DWorker;

                if (!currentNote || !dataTree || !worker) return;

                const { targetNote: editedNote, resultBool } = await runTaskOnWorker<TMessageNoteAddTagOnWorker, TReturnTypeNoteAddTag>(
                    worker,
                    { rootFolder: dataTree, targetNoteID: currentNote.id, tag: payload.tag, type: "note add tag" }
                );

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
                    log(action);
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
                    log(action);
                },
                fulfilled: (state, action) => {
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_FULFILLED));
                    window.dispatchEvent(new CustomEvent(EV_NAME_SAVE_DATA_REDUCER_END));
                    if (!action.payload) return;
                },
            }
        ),
        //удаляет тег из всего проекта
        projectDeleteTag: create.asyncThunk<
            { tagName: string },
            { deletedTagName: string; curentNoteInDB: TchildrenType | TNoteBody | null } | undefined
        >(
            async (payload, thunkApi) => {
                const state: RootState = thunkApi.getState() as RootState;
                const allTags = await getGlobalTagsDB();
                let dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!allTags || !dataTree) return;
                if (!worker) return;

                const { tagName: deletedTagName, resultBool } = await runTaskOnWorker<
                    TMessageProjectDeleteTagOnWorker,
                    TReturnTypeProjectDeleteTag
                >(worker, { tagData: allTags, rootFolder: dataTree, tagName: payload.tagName, type: "project delete tag" });

                if (!resultBool) {
                    throw new Error();
                }

                let curentNoteInDB: ReturnType<typeof getNodeById> = null;

                // после удаляения тега, нужно обновить данниы в редаксе, потомучто в активной заметке мог быть удаляемый тег

                if (state.saveDataInspect.currentNote) {
                    const find_id = state.saveDataInspect.currentNote.id as string;
                    dataTree = await getDataTreeDB();
                    curentNoteInDB = await runTaskOnWorker<TMessageGetNodeByIdOnWorker, TReturnTypeGetNodeById>(worker, {
                        type: "get node by id",
                        args: [dataTree, find_id],
                    });
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
                    log(action);
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
        projectEditTag: create.asyncThunk<
            { newTagName: string; newTagColor: TTagColors; oldTagName: string },
            { editedTagName: string; curentNoteInDB: TchildrenType | TNoteBody | null } | undefined
        >(
            async (payload, thunkApi) => {
                const state = thunkApi.getState() as RootState;
                const allTags = await getGlobalTagsDB();
                let dataTree = await getDataTreeDB();
                const worker = workerRef.DWorker;

                if (!allTags || !dataTree) return;
                if (!worker) return;

                const { newTagName: editedTagName, resultBool } = await runTaskOnWorker<
                    TMessageProjectEditeTagOnWorker,
                    TReturnTypeProjectEditeTag
                >(worker, {
                    tagData: allTags,
                    rootFolder: dataTree,
                    oldTagName: payload.oldTagName,
                    newTagName: payload.newTagName,
                    newTagColor: payload.newTagColor,
                    type: "project edite tag",
                });

                let curentNoteInDB: ReturnType<typeof getNodeById> = null;

                if (!resultBool) {
                    throw new Error();
                }

                // после изменения тега, нужно обновить данниые в редаксе, потомучто в активной заметке мог быть удаляемый тег
                if (state.saveDataInspect.currentNote) {
                    dataTree = await getDataTreeDB();
                    const find_id = state.saveDataInspect.currentNote.id as string;
                    curentNoteInDB = await runTaskOnWorker<TMessageGetNodeByIdOnWorker, TReturnTypeGetNodeById>(worker, {
                        args: [dataTree, find_id],
                        type: "get node by id",
                    });
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
                    log(action);
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
        addNewComponentInNote: create.asyncThunk<
            { noteId: string; componentType: TAllComponents },
            { updatedNote: TchildrenType | TNoteBody } | undefined
        >(
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
                    log(action);
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
    updateNoteComponentTextSettings,
    updateNoteComponentHeaderSettings,
    updateNoteComponentCodeSettings,
    exportTempDataSave,
    updateNoteComponentImage,
    updateNoteComponentImageSettings,
    updateNoteComponentLink,
    updateNoteComponentLinkSettings,
    redirectNoteComponentLink,
    updateNoteComponentsOrder,
    updateNoteComponentListSettings,
    updateNoteComponentTableDbData,
    updateNoteComponentTableDbSettings,
} = saveDataInspectSlice.actions;
export const { reducer } = saveDataInspectSlice;
export { saveDataInspectSlice };
export type { ISaveDataInspectStore };
