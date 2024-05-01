import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IEditDataSlice {
    isEdit: boolean;
    isLoading: boolean;
    isFsHide: boolean;
}

const initialState: IEditDataSlice = {
    isEdit: false, // включенли режим редактирования заметок
    isLoading: false, // сохранение удаление, перезапись в db , все кейсы когда нужно показать загрузку
    isFsHide: false, // скрыть боковцю понель навигации
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
        toggleFsHide: (state) => {
            state.isFsHide = !state.isFsHide;
        },
    },
});

export const { toggleIsEdit, setIsLoading, toggleFsHide } = editDataSlice.actions;
export const { reducer } = editDataSlice;
export { editDataSlice };
export type { IEditDataSlice };
