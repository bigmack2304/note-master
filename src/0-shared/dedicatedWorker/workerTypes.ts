import type { IDataTreeRootFolder } from "0-shared/types/dataSave";
import type { IFindNodeParametres } from "5-app/GlobalState/toolBarStore";
import type { TBodyComponentTable, TBodyComponentLink, TchildrenType, TTableValue, TNoteBody } from "0-shared/types/dataSave";
import { updateNoteComponentImageSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentImageSettings";

/**
 *  тип обьекта данных с функцией, для запуска этой функции в воркере
 */
type TMessageDataType = {
    argument_names: string[];
    argument_values: any[];
    func_data: string;
    type: "function executor";
};

/**
 *  тип обьекта для выполнения deleteById в воркере
 */
type TMessageDelById = {
    type: "delete by id";
    data: IDataTreeRootFolder;
    target: string;
    savedIdGenerator: string[];
};

/**
 *  тип обьекта для выполнения deleteComponentInNote в воркере
 */
type TMessageDelCompInNote = {
    type: "delete component in note";
    rootFolder: IDataTreeRootFolder;
    noteID: string;
    componentID: string;
    savedIdGenerator: string[];
};

/**
 *  тип обьекта для выполнения deleteComponentInNote в воркере
 */
type TMessageCloneFiltredTreeOnWorker = {
    type: "clone filtred tree";
    orig_obj: IDataTreeRootFolder;
    filtres: IFindNodeParametres | undefined;
};

/**
 *  тип обьекта для выполнения UpdateNodeValue в воркере
 */
type TMessageUpdateNodeValueOnWorker = {
    type: "update node value";
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    newValue: string;
};

/**
 *  тип обьекта для выполнения updNoteComponentsOrder в воркере
 */
type TMessageUpdNoteComponentsOrderOnWorker = {
    type: "update note components order";
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentDragId: string;
    toComponentDragId: string;
};

/**
 *  тип обьекта для выполнения updateNodeImage в воркере
 */
type TMessageUpdateNodeImageOnWorker = {
    type: "update node image";
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    newSrc: string;
    newName: string;
};

/**
 *  тип обьекта для выполнения updateNodeTable в воркере
 */
type TMessageUpdateNodeTableOnWorker = {
    type: "update node table";
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    newValue: TTableValue | "";
};

/**
 *  тип обьекта для выполнения updateNodeTableSettings в воркере
 */
type TMessageUpdateNodeTableSettingsOnWorker = {
    type: "update node table settings";
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    backlight: TBodyComponentTable["backlight"];
    desc: TBodyComponentTable["desc"];
    viewButtons: TBodyComponentTable["viewButtons"];
    aligin: TBodyComponentTable["aligin"];
};

/**
 *  тип обьекта для выполнения updateNodeLink в воркере
 */
type TMessageUpdateNodeLinkOnWorker = {
    type: "update node link";
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    target: TBodyComponentLink["target"];
    value: TBodyComponentLink["value"];
};

/**
 *  тип обьекта для выполнения getNodeById в воркере
 */
type TMessageGetNodeByIdOnWorker = {
    type: "get node by id";
    rootNode: IDataTreeRootFolder | TchildrenType | TNoteBody | undefined;
    find_id: string;
};

/**
 *  тип обьекта для выполнения updateNoteComponentLinkSettings в воркере
 */
type TMessageUpdateNoteComponentLinkSettingsOnWorker = {
    type: "update Note component link settings";
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    isLabel: TBodyComponentLink["isLabel"];
    isBg: TBodyComponentLink["background"];
    labelVal: TBodyComponentLink["labelValue"];
};

/**
 *  тип обьекта для выполнения updateNoteComponentImageSettings в воркере
 */
type TMessageUpdateNoteComponentImageSettingsOnWorker = {
    type: "update note component image settings";
    rootFolder: IDataTreeRootFolder;
    noteId: string;
    componentId: string;
    imageDesc: string;
    isDescHidden: boolean;
};

export type {
    TMessageDataType,
    TMessageDelById,
    TMessageDelCompInNote,
    TMessageCloneFiltredTreeOnWorker,
    TMessageUpdateNodeValueOnWorker,
    TMessageUpdNoteComponentsOrderOnWorker,
    TMessageUpdateNodeImageOnWorker,
    TMessageUpdateNodeTableOnWorker,
    TMessageUpdateNodeTableSettingsOnWorker,
    TMessageUpdateNodeLinkOnWorker,
    TMessageGetNodeByIdOnWorker,
    TMessageUpdateNoteComponentLinkSettingsOnWorker,
    TMessageUpdateNoteComponentImageSettingsOnWorker,
};
