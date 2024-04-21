import type { IDataTreeRootFolder } from "0-shared/types/dataSave";
import type { IFindNodeParametres } from "5-app/GlobalState/toolBarStore";
import type { TTableValue } from "0-shared/types/dataSave";
import type { TBodyComponentTable } from "0-shared/types/dataSave";

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
};
