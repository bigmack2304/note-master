import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./themeStore"; // реэкспорт через индекс почемуто не работает
import { ToolBarSlice } from "./toolBarStore";
import { saveDataInspectSlice } from "./saveDataInspectStore";
import { leftMenuSlice } from "./leftMenuStore";
import { editDataSlice } from "./noteStore";

const store = configureStore({
    reducer: {
        [themeSlice.name]: themeSlice.reducer,
        [ToolBarSlice.name]: ToolBarSlice.reducer,
        [saveDataInspectSlice.name]: saveDataInspectSlice.reducer,
        [leftMenuSlice.name]: leftMenuSlice.reducer,
        [editDataSlice.name]: editDataSlice.reducer,
    },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
