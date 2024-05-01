import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ILeftMenuState {
    isOpen: boolean;
}

const initialState: ILeftMenuState = {
    isOpen: false,
};

/**
 * слой redux store, содержит настройки связанные с боковым меню
 */
const leftMenuSlice = createSlice({
    name: "leftMenu",
    initialState,
    reducers: {
        toggleLeftMenu: (state) => {
            state.isOpen = !state.isOpen;
        },
        setIsOpen: (state, action: PayloadAction<{ isOpen: ILeftMenuState["isOpen"] }>) => {
            state.isOpen = action.payload.isOpen;
        },
    },
});

export const { toggleLeftMenu, setIsOpen } = leftMenuSlice.actions;
export const { reducer } = leftMenuSlice;
export { leftMenuSlice };
export type { ILeftMenuState };
