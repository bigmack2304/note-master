import type { PayloadAction, SerializedError } from "@reduxjs/toolkit";

function log<T extends PayloadAction<unknown, string, unknown, SerializedError>>(action: T) {
    console.group("async reducer reject!");
    console.log(action.type);
    console.log(action.error);
    console.log(action.meta);
    console.groupEnd();
}

export { log };
