import logo from "./assets/logo.svg";
import { AppBar } from "./components/AppBar/AppBar";
import { LeftMenu } from "./components/LeftMenu/LeftMenu";
import * as getSystemStyle from "0-shared/utils/getSystemStyle";
import { TransitionSlideRightForvardRef } from "./components/TransitionSlideFR/TransitionSlideFR";
import { useUiTeme } from "./hooks/useUiTeme";
import { WorkSpace } from "./components/WorkSpace/WorkSpace";

import type { GetProps } from "./utils/typeHelpers";

export { logo, AppBar, LeftMenu, getSystemStyle, TransitionSlideRightForvardRef, useUiTeme, WorkSpace };
export type { GetProps };
