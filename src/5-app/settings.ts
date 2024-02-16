import type { TTagColors } from "0-shared/types/dataSave";

const MAX_TAG_LENGTH = 10; // максимальная длинна имяни тега

// события для асинхронных редьюсеров в saveDataInspectSlice
// REJECT не обязательно значит что произошла ошибка, возможно не прошла какаято валидация
const EV_NAME_SAVE_DATA_REDUCER_START = "saveDataInspectReducerSart"; // начало операции
const EV_NAME_SAVE_DATA_REDUCER_REJECT = "saveDataInspectReducerRejected"; // ошибка
const EV_NAME_SAVE_DATA_REDUCER_END = "saveDataInspectReducerEnd"; // конец редьюсера, неважно ошибка или успех
const EV_NAME_SAVE_DATA_REDUCER_FULFILLED = "saveDataInspectReducerFulfield"; // успех

const TRANSITION_DURATION = 150; // длительность анимаций переходов в интерфейсе
const AUTO_THEME_DETECT = true; // при первом запуске, определяем тему приложения, если true то автоопределение

const THEME_LIGHT_GRAY = "#0000000d"; // затемнение для backround при светлой теме
const THEME_DARK_GRAY = "#00000029"; // затемнение для backround при темной теме
const OUTLINE_LIGHT_COLOR = "#00000024";
const OUTLINE_DARK_COLOR = "#ffffff24";

const TOOLBAR_BG_LIGHT_COLOR = "#32b6e4";
const TOOLBAR_BG_DARK_COLOR = "#1e3156";

// цвета для тегов при светлой и темной теме
const TAGS_COLORS_LIGHT: Record<TTagColors, string> = {
    red: "#ff4e4e",
    blue: "#6ba8ff",
    gray: "#c7c7c7",
    yellow: "#E1DD20",
    green: "#39C726",
    transparent: "#ffffff36",
};

export {
    TRANSITION_DURATION,
    AUTO_THEME_DETECT,
    THEME_LIGHT_GRAY,
    THEME_DARK_GRAY,
    OUTLINE_LIGHT_COLOR,
    OUTLINE_DARK_COLOR,
    TAGS_COLORS_LIGHT,
    TOOLBAR_BG_LIGHT_COLOR,
    TOOLBAR_BG_DARK_COLOR,
    EV_NAME_SAVE_DATA_REDUCER_START,
    EV_NAME_SAVE_DATA_REDUCER_REJECT,
    EV_NAME_SAVE_DATA_REDUCER_END,
    EV_NAME_SAVE_DATA_REDUCER_FULFILLED,
    MAX_TAG_LENGTH,
};
