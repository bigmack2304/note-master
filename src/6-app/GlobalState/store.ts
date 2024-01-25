import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "6-app/theme/themeStore"; // реэкспорт через индекс почемуто не работает

const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
    },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
