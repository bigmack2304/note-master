import { useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState } from "5-app/GlobalState/store";

// типизированая версия useSelector из redux

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAppSelector };
