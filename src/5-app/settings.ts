import type { TTagColors } from "0-shared/types/dataSave";

const APP_VERSION_MAJOR = 1; // обновляется вручную
const APP_VERSION_MINOR = 0; // обновляется автоматически
const APP_VERSION_PATCH = 178; // обновляется автоматически

// следующие параметры дублируют свои аналоги в settings.scss
const MIN_FULLSCREEN_W = 400; // минимальная ширина для fullscreen блоков
const MIN_DIALOG_WINDOW_W = 460; // минимальная ширина для dialogWindow.tsx
const MOBILE_SCREEN_MIN = 0; // митимальный размер окна для мобил
const TABLET_SCREEN_MIN = 400; // митимальный размер окна для плашетов
const DESCTOP_SCREEN_MIN = 1200; // митимальный размер окна для мониторов

const MAX_TAG_LENGTH = 10; // максимальная длинна имяни тега

// имена кастомных событий на которые может реагировать приложение
const EV_NAME_BUTTON_CLOSE_TREE_FOLDERS = "buttonCloseTreeFolders"; // закрыть все папки в окне с папками и заметками
const EV_NAME_SAVE_DATA_REDUCER_START = "saveDataInspectReducerSart"; // начало операции
const EV_NAME_SAVE_DATA_REDUCER_REJECT = "saveDataInspectReducerRejected"; // ошибка
const EV_NAME_SAVE_DATA_REDUCER_END = "saveDataInspectReducerEnd"; // конец редьюсера, неважно ошибка или успех
const EV_NAME_SAVE_DATA_REDUCER_FULFILLED = "saveDataInspectReducerFulfield"; // успех
const EV_NAME_LINK_NOTE_REDIRECT = "componentLinkRedirectToNote"; // переход по ссылке на заметку, также можно применить для выбора заметки в окне навигации
const EV_NAME_SAVE_DATA_REDUCER_SAVE_FULFILLED = "saveDataInspectReducerSaveFulfield"; // успешное сохранение
const EV_NAME_SAVE_DATA_REDUCER_LOAD_FULFILLED = "saveDataInspectReducerLoadFulfield"; // успешная загрузка
const EV_NAME_TABLE_SAVE = "tableSaveClick"; // нажатие на кнопку сохранить в компоненте таблицы
const EV_NAME_UPD_LOCAL_STORAGE = "appLocalStorageUpdate"; // изменение в localStorage (через appLocalStorage.ts или useLocalStorage.ts)
const EV_NAME_UPD_SESSION_STORAGE = "appSessionStorageUpdate"; // изменение в sessionStorage (через appSessionStorage.ts или useSessionStorage.ts)

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
const TABLE_CONTROLS_BG_DARK = "#3d4043";
const TABLE_CONTROLS_BORDER_DARK = "#8f8f8f";
//

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

// цвета для тегов при светлой и темной теме (кроме этого этот обьект напрямую влияет на очередь отображения цветов в списках)
const TAGS_COLORS_LIGHT: Record<TTagColors, string> = {
    transparent: "#aaaaaa24",
    gray: "#c7c7c7",
    blue: "#6ba8ff",
    whiteBlue: "#1B9EB0",
    red: "#ff4e4e",
    orange: "#DC8330",
    yellow: "#E1DD20",
    green: "#39C726",
    fern: "#8BB01B",
    blackGreen: "#267020",
    aquamarine: "#199060",
    fioletAlt: "#D020A7",
    fiolet: "#E66BFF",
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
    TABLE_CONTROLS_BG_DARK,
    TABLE_CONTROLS_BORDER_DARK,
    MIN_FULLSCREEN_W,
    MOBILE_SCREEN_MIN,
    TABLET_SCREEN_MIN,
    DESCTOP_SCREEN_MIN,
    MIN_DIALOG_WINDOW_W,
    EV_NAME_SAVE_DATA_REDUCER_SAVE_FULFILLED,
    EV_NAME_SAVE_DATA_REDUCER_LOAD_FULFILLED,
    EV_NAME_TABLE_SAVE,
    APP_VERSION_MINOR,
    APP_VERSION_MAJOR,
    APP_VERSION_PATCH,
    EV_NAME_UPD_LOCAL_STORAGE,
    EV_NAME_UPD_SESSION_STORAGE,
};
