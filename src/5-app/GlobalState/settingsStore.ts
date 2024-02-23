import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { get_stprage_data, storage_save_value } from "2-features/utils/appLoacalStorage";

interface ISettingsSlice {
    highlightingTagsInForms: boolean;
    treeViewWidth: number;
}

const initialState: ISettingsSlice = {
    highlightingTagsInForms: false, // подцветка тегов в формах
    treeViewWidth: 250, // ширина окна с заметками и папками
};

// в начале загружаем значения из localStorage
init_values();
function init_values() {
    initialState.highlightingTagsInForms = get_stprage_data().highlightingTagsInForms;
    initialState.treeViewWidth = get_stprage_data().treeViewWidth;
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
    },
});

export const { setHGLGTagsInForms, setTreeViewWidth } = settingsSlice.actions;
export const { reducer } = settingsSlice;
export { settingsSlice };
export type { ISettingsSlice };
