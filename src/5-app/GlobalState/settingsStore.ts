import { createSlice } from "@reduxjs/toolkit";
import { get_stprage_data, storage_save_value } from "2-features/utils/appLoacalStorage";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ISettingsSlice {
    highlightingTagsInForms: boolean;
    treeViewWidth: number;
    fsTools: boolean;
    noteMarginCollapse: boolean; //DEPRECATED
    treeViewNoteStatus: boolean;
    viewNoteStatus: boolean;
    viewNoteInfo: boolean;
}

const initialState: ISettingsSlice = {
    highlightingTagsInForms: false, // подцветка тегов в формах
    treeViewWidth: 250, // ширина окна с заметками и папками
    fsTools: false, // дополнительные инструменты для понели фаиловой струткуры
    noteMarginCollapse: false, // уменьшенные отступы в заметках //DEPRECATED
    treeViewNoteStatus: true, // показать статус заметки в блоке навигации
    viewNoteStatus: true, // показать блок статуса в заметках
    viewNoteInfo: true, // показать информацию о создании и редактировании в заметках
};

// в начале загружаем значения из localStorage
init_values();
function init_values() {
    initialState.highlightingTagsInForms = get_stprage_data().highlightingTagsInForms;
    initialState.treeViewWidth = get_stprage_data().treeViewWidth;
    initialState.fsTools = get_stprage_data().fsTools;
    initialState.noteMarginCollapse = get_stprage_data().noteMarginCollapse; //DEPRECATED
    initialState.treeViewNoteStatus = get_stprage_data().treeViewNoteStatus;
    initialState.viewNoteStatus = get_stprage_data().viewNoteStatus;
    initialState.viewNoteInfo = get_stprage_data().viewNoteInfo;
}

/**
 * слой содержит всякие настраиваемые параметры, в том числе которые синхронизируются с localStorage
 */
const settingsSlice = createSlice({
    name: "settingsData",
    initialState,
    reducers: {
        setHGLGTagsInForms: (state, action: PayloadAction<ISettingsSlice["highlightingTagsInForms"]>) => {
            state.highlightingTagsInForms = action.payload;
            storage_save_value("highlightingTagsInForms", action.payload);
        },
        setTreeViewWidth: (state, action: PayloadAction<ISettingsSlice["treeViewWidth"]>) => {
            state.treeViewWidth = action.payload;
            storage_save_value("treeViewWidth", action.payload);
        },
        setFsTools: (state, action: PayloadAction<ISettingsSlice["fsTools"]>) => {
            state.fsTools = action.payload;
            storage_save_value("fsTools", action.payload);
        },
        //DEPRECATED
        setNoteMarginCollapse: (state, action: PayloadAction<ISettingsSlice["noteMarginCollapse"]>) => {
            state.noteMarginCollapse = action.payload;
            storage_save_value("noteMarginCollapse", action.payload);
        },
        setTreeViewNoteStatus: (state, action: PayloadAction<ISettingsSlice["treeViewNoteStatus"]>) => {
            state.treeViewNoteStatus = action.payload;
            storage_save_value("treeViewNoteStatus", action.payload);
        },
        setViewNoteStatus: (state, action: PayloadAction<ISettingsSlice["viewNoteStatus"]>) => {
            state.viewNoteStatus = action.payload;
            storage_save_value("viewNoteStatus", action.payload);
        },
        setViewNoteInfo: (state, action: PayloadAction<ISettingsSlice["viewNoteInfo"]>) => {
            state.viewNoteInfo = action.payload;
            storage_save_value("viewNoteInfo", action.payload);
        },
    },
});

export const {
    setHGLGTagsInForms,
    setTreeViewWidth,
    setFsTools,
    setNoteMarginCollapse,
    setTreeViewNoteStatus,
    setViewNoteStatus,
    setViewNoteInfo,
} = settingsSlice.actions;
export const { reducer } = settingsSlice;
export { settingsSlice };
export type { ISettingsSlice };
