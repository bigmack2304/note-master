import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { isDark } from "0-shared/utils/getSystemStyle";
import { AUTO_THEME_DETECT } from "5-app/settings";
import { get_stprage_data, storage_save_value } from "2-features/utils/appLoacalStorage";

interface IThemeState {
    isDark: boolean;
    isAuto: boolean;
}

const initialState: IThemeState = {
    isAuto: AUTO_THEME_DETECT,
    isDark: false,
};

// в начале загружаем значения из localStorage
init_values();
function init_values() {
    initialState.isAuto = get_stprage_data().isAuto;
    initialState.isDark = get_stprage_data().isDark;

    if (initialState.isAuto) {
        initialState.isDark = isDark();
        storage_save_value("isDark", initialState.isDark);
    }
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        sethemeName: (state, action: PayloadAction<"light" | "dark">) => {
            state.isDark = action.payload === "light" ? false : true;
            state.isAuto = false;
            storage_save_value("isAuto", false);
            storage_save_value("isDark", state.isDark);
        },
        setIsDark: (state, action: PayloadAction<IThemeState["isDark"]>) => {
            state.isDark = action.payload;
            state.isAuto = false;
            storage_save_value("isAuto", false);
            storage_save_value("isDark", state.isDark);
        },
        setIsAuto: (state, action: PayloadAction<IThemeState["isAuto"]>) => {
            state.isAuto = action.payload;
            storage_save_value("isAuto", state.isAuto);

            if (action.payload === false) return;

            if (isDark()) {
                state.isDark = true;
            } else {
                state.isDark = false;
            }

            storage_save_value("isDark", state.isDark);
        },
    },
});

export const { sethemeName, setIsDark, setIsAuto } = themeSlice.actions;
export const { reducer } = themeSlice;
export { themeSlice };
export type { IThemeState };
