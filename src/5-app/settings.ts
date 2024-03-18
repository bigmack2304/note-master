import type { TTagColors } from "0-shared/types/dataSave";

const MIN_FULLSCREEN_W = 400; // минимальная ширина fullscreen блоков
const MAX_TAG_LENGTH = 10; // максимальная длинна имяни тега

// события для асинхронных редьюсеров в saveDataInspectSlice
// REJECT не обязательно значит что произошла ошибка, возможно не прошла какаято валидация
const EV_NAME_BUTTON_CLOSE_TREE_FOLDERS = "buttonCloseTreeFolders"; // закрыть все папки в окне с папками и заметками
const EV_NAME_SAVE_DATA_REDUCER_START = "saveDataInspectReducerSart"; // начало операции
const EV_NAME_SAVE_DATA_REDUCER_REJECT = "saveDataInspectReducerRejected"; // ошибка
const EV_NAME_SAVE_DATA_REDUCER_END = "saveDataInspectReducerEnd"; // конец редьюсера, неважно ошибка или успех
const EV_NAME_SAVE_DATA_REDUCER_FULFILLED = "saveDataInspectReducerFulfield"; // успех
const EV_NAME_LINK_NOTE_REDIRECT = "componentLinkRedirectToNote"; // переход по ссылке на заметку, также можно применить для выбора заметки в окне навигации

const TRANSITION_DURATION = 150; // длительность анимаций переходов в интерфейсе
const AUTO_THEME_DETECT = true; // при первом запуске, определяем тему приложения, если true то автоопределение

// цвета при наведении
const HOVER_DARK = "#FFFFFF24";
const HOVER_LIGHT = "#00000017";

// цвета акнивного элемента (для ячеек таблицы)
const ACTIVE_CELL_DARK = "#4b86d070";
const ACTIVE_CELL_LIGHT = "#75ccff70";

// ЦВЕТ для всяких кнопок
const CONTROLS_PRIMARY_LIGHT = "#288CEF";
const CONTROLS_PRIMARY_DARK = "#52D522";

// цвета выбора колонок в таблице
const CELL_SELECT_LIGHT = "#288BEF25";
const CELL_SELECT_DARK = "#52D52228";

const THEME_LIGHT_GRAY = "#0000000d"; // затемнение для backround при светлой теме
const THEME_DARK_GRAY = "#00000029"; // затемнение для backround при темной теме
const OUTLINE_LIGHT_COLOR = "#00000024";
const OUTLINE_DARK_COLOR = "#ffffff24";

const TOOLBAR_BG_LIGHT_COLOR = "#32b6e4";
const TOOLBAR_BG_DARK_COLOR = "#1e3156";
const TOOLBAR_BORDER_DARK_COLOR = "#000000ba";
const TOOLBAR_BORDER_LIGHT_COLOR = "#000000a1";

const BORDER_LIGHT = "#1A1A1A";
const BORDER_DARK = "#E6E6E6";

const NOTE_STATUS_COMPLETE = "#349515";
const NOTE_STATUS_NO_COMPLETE = "#ff692d";

// цвета для тегов при светлой и темной теме
const TAGS_COLORS_LIGHT: Record<TTagColors, string> = {
    red: "#ff4e4e",
    blue: "#6ba8ff",
    gray: "#c7c7c7",
    yellow: "#E1DD20",
    green: "#39C726",
    transparent: "#aaaaaa24",
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
    TOOLBAR_BORDER_DARK_COLOR,
    TOOLBAR_BORDER_LIGHT_COLOR,
    BORDER_LIGHT,
    BORDER_DARK,
    NOTE_STATUS_COMPLETE,
    NOTE_STATUS_NO_COMPLETE,
    EV_NAME_LINK_NOTE_REDIRECT,
    EV_NAME_BUTTON_CLOSE_TREE_FOLDERS,
    CONTROLS_PRIMARY_LIGHT,
    CONTROLS_PRIMARY_DARK,
    HOVER_DARK,
    HOVER_LIGHT,
    CELL_SELECT_LIGHT,
    CELL_SELECT_DARK,
    ACTIVE_CELL_DARK,
    ACTIVE_CELL_LIGHT,
};
