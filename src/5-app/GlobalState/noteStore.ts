import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IEditDataSlice {
    isEdit: boolean;
}

const initialState: IEditDataSlice = {
    isEdit: true,
};

/**
 * слой redux store, содержит настройки связанные с боковым меню
 */
const editDataSlice = createSlice({
    name: "noteEditData",
    initialState,
    reducers: {
        setIsEdit: (state, action: PayloadAction<IEditDataSlice["isEdit"]>) => {
            state.isEdit = action.payload;
        },
    },
});

export const { setIsEdit } = editDataSlice.actions;
export const { reducer } = editDataSlice;
export { editDataSlice };
export type { IEditDataSlice };
