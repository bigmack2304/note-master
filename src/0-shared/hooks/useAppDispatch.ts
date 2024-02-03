import { AppDispatch } from "5-app/GlobalState/store";
import { useDispatch } from "react-redux";

// типизированая версия useDispatch из redux

const useAppDispatch: () => AppDispatch = useDispatch;

export { useAppDispatch };
