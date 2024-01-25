import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IThemeState {
    isDark: boolean;
}

const initialState: IThemeState = {
    isDark: false,
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        sethemeName: (state, action: PayloadAction<"light" | "dark">) => {
            state.isDark = action.payload === "light" ? false : true;
        },
        setIsDark: (state, action: PayloadAction<IThemeState["isDark"]>) => {
            state.isDark = action.payload;
        },
    },
});

export const { sethemeName, setIsDark } = themeSlice.actions;
export const { reducer } = themeSlice;
export { themeSlice };
