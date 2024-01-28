import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getSystemStyle } from "0-shared";

interface IThemeState {
    isDark: boolean;
    isAuto: boolean;
}

const initialState: IThemeState = {
    isAuto: true,
    isDark: false,
};

// На случай если нужно будет поменять значение темы по умолчанию, сразу тут ее вычислим
if (initialState.isAuto) {
    initialState.isDark = getSystemStyle.isDark();
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        sethemeName: (state, action: PayloadAction<"light" | "dark">) => {
            state.isDark = action.payload === "light" ? false : true;
            state.isAuto = false;
        },
        setIsDark: (state, action: PayloadAction<IThemeState["isDark"]>) => {
            state.isDark = action.payload;
            state.isAuto = false;
        },
        setIsAuto: (state, action: PayloadAction<IThemeState["isAuto"]>) => {
            state.isAuto = action.payload;

            if (action.payload === false) return;

            if (getSystemStyle.isDark()) {
                state.isDark = true;
            } else {
                state.isDark = false;
            }
        },
    },
});

export const { sethemeName, setIsDark, setIsAuto } = themeSlice.actions;
export const { reducer } = themeSlice;
export { themeSlice };
export type { IThemeState };
