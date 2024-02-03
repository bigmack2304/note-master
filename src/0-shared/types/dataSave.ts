// варианты своиств в зависимости от компонента внутри заметки
// заголовок
interface TBodyComponentHeader {
    component: "header";
    value: string;
}

// текст
interface TBodyComponentText {
    component: "text";
    texValue: string;
}
//////////////////////////////////////////////////////////////////

type nodeType = "component" | "note" | "folder";

// общие поля компонентов внутри заметки
interface IDataTreeitemBody {
    id: string; // глобальный id во всем дереве
    type: nodeType;
}

// тип поля body в заметке
// TODO: потом тип пойдет по такому примеру
//type TNoteBody = IDataTreeitemBody & (TBodyComponentHeader | TBodyComponentText);
type TNoteBody = IDataTreeitemBody & TBodyComponentHeader;

// типизация тега заметок
interface IGlobalTag {
    tag_name: string;
    color: string;
    text: string;
}

// тип, папка или заметка
type TchildrenType = IDataTreeFolder | IDataTreeNote;

// типизация заметки
interface IDataTreeNote {
    id: string; // глобальный id во всем дереве
    tags?: IGlobalTag["tag_name"][];
    name: string;
    type: nodeType;
    body: TNoteBody[];
}

// типизация папки
interface IDataTreeFolder {
    name: string;
    color: string;
    id: string; // глобальный id во всем дереве
    type: nodeType;
    children?: TchildrenType[];
}

// типизация фаила с сохранением
interface IDataSave {
    db_type: string;
    global_tags: IGlobalTag[];
    data_tree: IDataTreeFolder;
}

export type { IDataSave, IDataTreeFolder, IDataTreeNote, IGlobalTag, TNoteBody, TchildrenType, nodeType, IDataTreeitemBody };
