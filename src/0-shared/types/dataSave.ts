// типы всех компонентов
type TAllComponents = "header" | "text";

// варианты своиств в зависимости от компонента внутри заметки
// заголовок
interface TBodyComponentHeader {
    component: "header";
    value: string;
}

// текст
interface TBodyComponentText {
    component: "text";
    value: string;
    background: boolean;
    formatting: boolean;
    font: "default" | "code";
    lineBreak: boolean;
}
//////////////////////////////////////////////////////////////////
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

/**
 * тип поля body в заметке
 */
type TNoteBody = IDataTreeNode & (TBodyComponentHeader | TBodyComponentText);

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

// все теги
interface IAllTags {
    [TAG_NAME: string]: IGlobalTag;
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
};
