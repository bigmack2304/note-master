import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
/**
 * надстройка для createSlice, позволяет создавать асинхронные редьюсеры
 */
const createAppSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

export { createAppSlice };
