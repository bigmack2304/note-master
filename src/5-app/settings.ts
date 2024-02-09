import type { TTagColors } from "0-shared/types/dataSave";

const TRANSITION_DURATION = 150; // длительность анимаций переходов в интерфейсе
const AUTO_THEME_DETECT = true; // при первом запуске, определяем тему приложения, если true то автоопределение

const THEME_LIGHT_GRAY = "#0000000d"; // затемнение для backround при светлой теме
const THEME_DARK_GRAY = "#00000029"; // затемнение для backround при темной теме
const OUTLINE_LIGHT_COLOR = "#00000024";
const OUTLINE_DARK_COLOR = "#ffffff24";

const TAGS_COLORS: Record<TTagColors, string> = {
    red: "#BA2D2D",
    blue: "#3357CC",
    gray: "#3C3C3C2F",
    yellow: "#E1DD20",
    green: "#39C726",
};

export { TRANSITION_DURATION, AUTO_THEME_DETECT, THEME_LIGHT_GRAY, THEME_DARK_GRAY, OUTLINE_LIGHT_COLOR, OUTLINE_DARK_COLOR, TAGS_COLORS };
