import { createSlice } from "@reduxjs/toolkit";
import { get_stprage_data, storage_save_value } from "2-features/utils/appLoacalStorage";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IFindNodeParametres {
    name: string;
    tags: string[];
    content: string;
}

interface IToolBarStore {
    isActive: boolean; // показать панель инструментов
    // опции связанные с поиском заметки в дереве
    findNodeTree: IFindNodeParametres | undefined;
}

const initialState: IToolBarStore = {
    isActive: false,
    findNodeTree: undefined,
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
        setFindNodeTree: (state, action: PayloadAction<IToolBarStore["findNodeTree"]>) => {
            state.findNodeTree = action.payload;
        },
        resetFindNodeTree: (state) => {
            state.findNodeTree = undefined;
        },
    },
});

export const { toggleIsActive, setFindNodeTree, resetFindNodeTree } = ToolBarSlice.actions;
export const { reducer } = ToolBarSlice;
export { ToolBarSlice };
export type { IToolBarStore, IFindNodeParametres };
