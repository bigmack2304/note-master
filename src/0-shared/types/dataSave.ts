import type { TCodeLanguages, TCodeThemes } from "0-shared/components/NoteCode/NoteCodeTypes";

/**
 * все возможные значения type в node
 */
type TNodeType = "component" | "note" | "folder";

/**
 * общие поля компонентов внутри заметки
 */
interface IDataTreeNode {
    id: string; // глобальный id во всем дереве
    type: TNodeType;
}

// типы всех компонентов
type TAllComponents = "header" | "text" | "code" | "image";

// варианты своиств в зависимости от компонента внутри заметки
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

// код
interface TBodyComponentCode extends IDataTreeNode {
    component: "code";
    value: string;
    language: TCodeLanguages;
    codeTheme: TCodeThemes;
}

// картинка
interface TBodyComponentImage extends IDataTreeNode {
    component: "image";
    value: string; // это поле либо пустое либо = id этого компонента, если тут  есть id то по нему будет подгружатся данные из db
    fileName: string;
    desc: string;
    isDescHidden: boolean;
}
//////////////////////////////////////////////////////////////////

/**
 * тип поля body в заметке
 */
type TNoteBody = TBodyComponentHeader | TBodyComponentText | TBodyComponentCode | TBodyComponentImage;

/**
 * цвета тега
 */
type TTagColors = "red" | "blue" | "gray" | "yellow" | "green" | "transparent";

/**
 * типизация тега заметок
 */
interface IGlobalTag {
    tag_name: string;
    color: TTagColors;
}

/**
 * типизация картинки заметок
 */
interface IImage {
    id: string;
    src: string;
    desc: string;
}

// все теги
interface IAllTags {
    [TAG_NAME: string]: IGlobalTag;
}

// хранилеще картинок
interface IDataImages {
    [IMG_ID: string]: IImage;
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
};
