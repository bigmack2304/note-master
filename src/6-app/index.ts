import App from "./App/App";
import normalize from "./normalize/normalize.module.scss";
import baseStyles from "./baseStyles/baseStyles.module.scss";
import { store } from "./GlobalState/store";
import { theme } from "./theme/theme";

import type { RootState, AppDispatch } from "./GlobalState/store";

export { App, normalize, baseStyles, store, theme };
export type { RootState, AppDispatch };
