import type { TCodeLanguages, TCodeThemes } from "0-shared/components/NoteCode/NoteCodeTypes";
/**
 * ДАННЫЙ ФАИЛ СОДЕРЖИТ ТИПИЗАЦИЮ СТРУКТУРЫ В INDEXED DB С КОТОРОЙ МЫ РАБОТАЕМ ПРИ ЛЮБОМ ВЗАИМОДЕЙСТВИИ С ЗАМЕТКАМИ
 * А ТАКЖЕ ТИПИЗАЦИЮ ВСЕГО ИЗ ЧЕГО МОЖЕТ СОСТОЯТЬ ЗАМЕТКА
 */

/**
 * все возможные значения type в node
 */
type TNodeType = "component" | "note" | "folder";

/**
 * общие поля для всех нод data_tree
 */
interface IDataTreeNode {
    id: string; // глобальный id во всем дереве
    type: TNodeType;
}

// типы всех компонентов
type TAllComponents = "header" | "text" | "code" | "image" | "link" | "video" | "list" | "table";

// видео
interface TBodyComponentVideo extends IDataTreeNode {
    component: "video";
    value: string;
}

// заголовок
interface TBodyComponentHeader extends IDataTreeNode {
    component: "header";
    value: string;
    textAligin: "left" | "center" | "right";
    headerSize: "h2" | "h3" | "h4" | "h5" | "h6";
}

// текст
interface TBodyComponentText extends IDataTreeNode {
    component: "text";
    value: string;
    background: boolean;
    formatting: boolean;
    font: "default" | "code";
    lineBreak: boolean;
}

// ссылка
interface TBodyComponentLink extends IDataTreeNode {
    component: "link";
    value: string;
    labelValue: string;
    isLabel: boolean;
    background: boolean;
    target: "web" | "note";
}

// код
interface TBodyComponentCode extends IDataTreeNode {
    component: "code";
    value: string;
    language: TCodeLanguages;
    codeTheme: TCodeThemes;
    isExpand: boolean;
    expandDesc: string;
}

// картинка
interface TBodyComponentImage extends IDataTreeNode {
    component: "image";
    value: string; // это поле либо пустое либо = id этого компонента, если тут  есть id то по нему будет подгружатся данные из db
    fileName: string;
    desc: string;
    isDesc: boolean;
}

// cсписок
interface TBodyComponentList extends IDataTreeNode {
    component: "list";
    value: string; // содержимое хранится в виде JSON преобразуемого в обьект такого типа {"li":string[]}
    isNumeric: boolean;
    background: boolean;
    textAligin: "left" | "center" | "right";
}

// таблица
interface TBodyComponentTable extends IDataTreeNode {
    component: "table";
    desc: string;
    viewButtons: boolean;
    backlight: boolean;
    aligin: "left" | "center" | "right";
    value: string;
}

/// дополнительные типы для таблиц ///////////////////////////////////////////////////////////////

type TTableRowColumnItem = {
    value: string;
    colIndex: number;
};

type TTableRow = {
    value: TTableRowColumnItem[];
    rowIndex: number;
};

type TTableValue = {
    headers: TTableRowColumnItem[];
    rows: TTableRow[];
};

//////////////////////////////////////////////////////////////////

/**
 * тип поля body в заметке
 */
type TNoteBody =
    | TBodyComponentHeader
    | TBodyComponentText
    | TBodyComponentCode
    | TBodyComponentImage
    | TBodyComponentLink
    | TBodyComponentVideo
    | TBodyComponentList
    | TBodyComponentTable;

/**
 * цвета тега
 */
type TTagColors =
    | "red"
    | "blue"
    | "gray"
    | "yellow"
    | "green"
    | "transparent"
    | "fiolet"
    | "orange"
    | "whiteBlue"
    | "fern"
    | "aquamarine"
    | "blackGreen"
    | "fioletAlt";

/**
 * типизация тега заметок
 */
interface IGlobalTag {
    tag_name: string;
    color: TTagColors;
}

/**
 * типизация картинки (в db)
 */
interface IImage {
    id: string;
    src: string;
    desc: string;
}

/**
 * типизация таблицы (в db)
 */
interface ITable {
    id: string;
    value: TTableValue;
}

// все теги
interface IAllTags {
    [TAG_NAME: string]: IGlobalTag;
}

// хранилеще картинок
interface IDataImages {
    [IMG_ID: string]: IImage;
}

// хранилеще таблиц
interface IDataTables {
    [TABLE_ID: string]: ITable;
}

/**
 * тип, папка или заметка
 */
type TchildrenType = IDataTreeFolder | IDataTreeNote;

/**
 * типизация заметки
 */
interface IDataTreeNote extends IDataTreeNode {
    tags?: IGlobalTag["tag_name"][];
    name: string;
    body: TNoteBody[];
    createTime: number;
    lastEditTime: number;
    completed: boolean;
}

/**
 * типизация папки
 */
interface IDataTreeFolder extends IDataTreeNode {
    name: string;
    color: string;
    children?: TchildrenType[];
}

/**
 * типизация корневой папки
 */
interface IDataTreeRootFolder extends IDataTreeFolder {
    name: "root";
    id: "root";
}

/**
 * типизация фаила с сохранением
 */
interface IDataSave {
    db_type: "note_Master";
    global_tags: IAllTags;
    data_tree: IDataTreeRootFolder;
    data_images: IDataImages;
    data_tables: IDataTables;
}

export type {
    IDataSave,
    IDataTreeFolder,
    IDataTreeNote,
    IGlobalTag,
    TNoteBody,
    TchildrenType,
    TNodeType,
    IDataTreeNode,
    IDataTreeRootFolder,
    TTagColors,
    IAllTags,
    TAllComponents,
    TBodyComponentHeader,
    TBodyComponentText,
    TBodyComponentCode,
    IImage,
    IDataImages,
    TBodyComponentImage,
    TBodyComponentLink,
    TBodyComponentVideo,
    TBodyComponentList,
    TBodyComponentTable,
    TTableValue,
    TTableRow,
    TTableRowColumnItem,
};
