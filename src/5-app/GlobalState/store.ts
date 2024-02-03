import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./themeStore"; // реэкспорт через индекс почемуто не работает
import { ToolBarSlice } from "./toolBarStore";
import { saveDataInspectSlice } from "./saveDataInspectStore";

const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
        toolBar: ToolBarSlice.reducer,
        saveDataInspect: saveDataInspectSlice.reducer,
    },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
