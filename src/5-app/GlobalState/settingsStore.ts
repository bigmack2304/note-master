import { createSlice } from "@reduxjs/toolkit";
import { get_stprage_data, storage_save_value } from "2-features/utils/appLoacalStorage";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ISettingsSlice {
    highlightingTagsInForms: boolean;
    treeViewWidth: number;
    fsTools: boolean;
    noteMarginCollapse: boolean; //DEPRECATED
}

const initialState: ISettingsSlice = {
    highlightingTagsInForms: false, // подцветка тегов в формах
    treeViewWidth: 250, // ширина окна с заметками и папками
    fsTools: false, // дополнительные инструменты для понели фаиловой струткуры
    noteMarginCollapse: false, // уменьшенные отступы в заметках //DEPRECATED
};

// в начале загружаем значения из localStorage
init_values();
function init_values() {
    initialState.highlightingTagsInForms = get_stprage_data().highlightingTagsInForms;
    initialState.treeViewWidth = get_stprage_data().treeViewWidth;
    initialState.fsTools = get_stprage_data().fsTools;
    initialState.noteMarginCollapse = get_stprage_data().noteMarginCollapse; //DEPRECATED
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
    },
});

export const { setHGLGTagsInForms, setTreeViewWidth, setFsTools, setNoteMarginCollapse } = settingsSlice.actions;
export const { reducer } = settingsSlice;
export { settingsSlice };
export type { ISettingsSlice };
