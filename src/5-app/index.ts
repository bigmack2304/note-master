import App from "./App/App";
import normalize from "./normalize/normalize.module.scss";
import baseStyles from "./baseStyles/baseStyles.module.scss";
import { store } from "./GlobalState/store";

import type { RootState, AppDispatch } from "./GlobalState/store";

const TRANSITION_DURATION = 150;

export { App, normalize, baseStyles, store, TRANSITION_DURATION };
export type { RootState, AppDispatch };
