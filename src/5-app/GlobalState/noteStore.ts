import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IEditDataSlice {
    isEdit: boolean;
    isLoading: boolean;
}

const initialState: IEditDataSlice = {
    isEdit: false,
    isLoading: false,
};

/**
 * слой redux store, содержит настройки связанные с рабочим фаилом
 */
const editDataSlice = createSlice({
    name: "noteEditData",
    initialState,
    reducers: {
        toggleIsEdit: (state) => {
            state.isEdit = !state.isEdit;
        },
        setIsLoading: (state, action: PayloadAction<IEditDataSlice["isLoading"]>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { toggleIsEdit, setIsLoading } = editDataSlice.actions;
export const { reducer } = editDataSlice;
export { editDataSlice };
export type { IEditDataSlice };
