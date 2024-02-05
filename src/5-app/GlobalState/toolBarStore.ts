import { createSlice } from "@reduxjs/toolkit";
import { get_stprage_data, storage_save_value } from "2-features/utils/appLoacalStorage";

interface IToolBarStore {
    isActive: boolean;
}

const initialState: IToolBarStore = {
    isActive: false,
};

// в начале загружаем значения из localStorage
init_values();
function init_values() {
    initialState.isActive = get_stprage_data().isToolBar;
}

/**
 * слой redux store, содержит настройки с панелью инструментов
 */
const ToolBarSlice = createSlice({
    name: "toolBar",
    initialState,
    reducers: {
        toggleIsActive: (state) => {
            state.isActive = !state.isActive;
            storage_save_value("isToolBar", state.isActive);
        },
    },
});

export const { toggleIsActive } = ToolBarSlice.actions;
export const { reducer } = ToolBarSlice;
export { ToolBarSlice };
export type { IToolBarStore };
