import type { TParametersUpdateNoteComponentImageSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentImageSettings";
import type { TParametersUpdateNoteComponentLinkSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentLinkSettings";
import type { TParametersGetNodeById } from "2-features/utils/saveDataParseFunctions/getNodeById";
import type { TParametersUpdateNodeLink } from "2-features/utils/saveDataEditFunctions/updateNodeLink";
import type { TParametersUpdateNodeTableSettings } from "2-features/utils/saveDataEditFunctions/updateNodeTableSettings";
import type { TParametersUpdateNodeTable } from "2-features/utils/saveDataEditFunctions/updateNodeTable";
import type { TParametersUpdateNodeImage } from "2-features/utils/saveDataEditFunctions/updateNoteImage";
import type { TParametersUpdNoteComponentsOrder } from "2-features/utils/saveDataEditFunctions/updNoteComponentsOrder";
import type { TParametersUpdateNodeValue } from "2-features/utils/saveDataEditFunctions/updateNoteValue";
import type { TParametersDeleteComponentInNote } from "2-features/utils/saveDataEditFunctions/deleteComponentInNote";
import type { TParametersDeleteById } from "2-features/utils/saveDataEditFunctions/deleteById";
import type { TParametersCloneFiltredTree } from "0-shared/utils/note_find";
import type { TParametersUpdateNoteComponentTextSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentTextSettings";
import type { TParametersUpdateNoteComponentListSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentListSettings";
import type { TParametersUpdateNoteComponentHeaderSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentHeaderSettings";
import type { TParametersUpdateNoteComponentCodeSettings } from "2-features/utils/saveDataEditFunctions/componentCodeSettings";
import type { TParametersUpdateNodeCompleted } from "2-features/utils/saveDataEditFunctions/updateNodeCompleted";
import type { TParametersUpdateNodeName } from "2-features/utils/saveDataEditFunctions/updateNodeName";
import type { TParametersAddNodeTo } from "2-features/utils/saveDataEditFunctions/addNodeTo";
import type { TParametersNodeMuveTo } from "2-features/utils/saveDataEditFunctions/nodeMuveTo";
import type { TParametersNoteDeleteTag } from "2-features/utils/saveDataEditFunctions/noteDeleteTag";
import type { TParametersNoteAddTag } from "2-features/utils/saveDataEditFunctions/noteAddTag";
import type { TParametersProjectDeleteTag } from "2-features/utils/saveDataEditFunctions/projectDeleteTag";
import type { TParametersGetParentNode } from "2-features/utils/saveDataParseFunctions/getParentNode";
import type { TParametersProjectEditeTag } from "2-features/utils/saveDataEditFunctions/projectEditeTag";
import type { TParametersAddNewComponentToNote } from "2-features/utils/saveDataEditFunctions/addNewComponentToNote";

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
type TMessageDelById<FUNC_PARAMS = TParametersDeleteById[0]> = {
    type: "delete by id";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения deleteComponentInNote в воркере
 */
type TMessageDelCompInNote<FUNC_PARAMS = TParametersDeleteComponentInNote[0]> = {
    type: "delete component in note";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения deleteComponentInNote в воркере
 */
type TMessageCloneFiltredTreeOnWorker = {
    type: "clone filtred tree";
    args: TParametersCloneFiltredTree;
};

/**
 *  тип обьекта для выполнения UpdateNodeValue в воркере
 */
type TMessageUpdateNodeValueOnWorker<FUNC_PARAMS = TParametersUpdateNodeValue[0]> = {
    type: "update node value";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updNoteComponentsOrder в воркере
 */
type TMessageUpdNoteComponentsOrderOnWorker<FUNC_PARAMS = TParametersUpdNoteComponentsOrder[0]> = {
    type: "update note components order";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNodeImage в воркере
 */
type TMessageUpdateNodeImageOnWorker<FUNC_PARAMS = TParametersUpdateNodeImage[0]> = {
    type: "update node image";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNodeTable в воркере
 */
type TMessageUpdateNodeTableOnWorker<FUNC_PARAMS = TParametersUpdateNodeTable[0]> = {
    type: "update node table";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNodeTableSettings в воркере
 */
type TMessageUpdateNodeTableSettingsOnWorker<FUNC_PARAMS = TParametersUpdateNodeTableSettings[0]> = {
    type: "update node table settings";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNodeLink в воркере
 */
type TMessageUpdateNodeLinkOnWorker<FUNC_PARAMS = TParametersUpdateNodeLink[0]> = {
    type: "update node link";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения getNodeById в воркере
 */
type TMessageGetNodeByIdOnWorker = {
    type: "get node by id";
    args: TParametersGetNodeById;
};

/**
 *  тип обьекта для выполнения updateNoteComponentLinkSettings в воркере
 */
type TMessageUpdateNoteComponentLinkSettingsOnWorker<FUNC_PARAMS = TParametersUpdateNoteComponentLinkSettings[0]> = {
    type: "update Note component link settings";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNoteComponentImageSettings в воркере
 */
type TMessageUpdateNoteComponentImageSettingsOnWorker<FUNC_PARAMS = TParametersUpdateNoteComponentImageSettings[0]> = {
    type: "update note component image settings";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNoteComponentTextSettings в воркере
 */
type TMessageUpdateNoteComponentTextSettingsOnWorker<FUNC_PARAMS = TParametersUpdateNoteComponentTextSettings[0]> = {
    type: "update note component text settings";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNoteComponentListSettings в воркере
 */
type TMessageUpdateNoteComponentListSettingsOnWorker<FUNC_PARAMS = TParametersUpdateNoteComponentListSettings[0]> = {
    type: "update note component list settings";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNoteComponentHeaderSettings в воркере
 */
type TMessageUpdateNoteComponentHeaderSettingsOnWorker<FUNC_PARAMS = TParametersUpdateNoteComponentHeaderSettings[0]> = {
    type: "update note component header settings";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNoteComponentCodeSettings в воркере
 */
type TMessageUpdateNoteComponentCodeSettingsOnWorker<FUNC_PARAMS = TParametersUpdateNoteComponentCodeSettings[0]> = {
    type: "update note component code settings";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNodeCompleted в воркере
 */
type TMessageUpdateNodeCompletedOnWorker<FUNC_PARAMS = TParametersUpdateNodeCompleted[0]> = {
    type: "update node completed";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения updateNodeName в воркере
 */
type TMessageUpdateNodeNameOnWorker<FUNC_PARAMS = TParametersUpdateNodeName[0]> = {
    type: "update node name";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения addNodeTo в воркере
 */
type TMessageAddNodeToOnWorker<FUNC_PARAMS = TParametersAddNodeTo[0]> = {
    type: "add node to";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения nodeMuveTo в воркере
 */
type TMessageNodeMuveToOnWorker<FUNC_PARAMS = TParametersNodeMuveTo[0]> = {
    type: "node move to";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения noteDeleteTag в воркере
 */
type TMessageNoteDeleteTagOnWorker<FUNC_PARAMS = TParametersNoteDeleteTag[0]> = {
    type: "note delete tag";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения noteAddTag в воркере
 */
type TMessageNoteAddTagOnWorker<FUNC_PARAMS = TParametersNoteAddTag[0]> = {
    type: "note add tag";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения projectDeleteTag в воркере
 */
type TMessageProjectDeleteTagOnWorker<FUNC_PARAMS = TParametersProjectDeleteTag[0]> = {
    type: "project delete tag";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения getParentNode в воркере
 */
type TMessageGetParentNodeOnWorker = {
    type: "get parent node";
    args: TParametersGetParentNode;
};

/**
 *  тип обьекта для выполнения projectEditeTag в воркере
 */
type TMessageProjectEditeTagOnWorker<FUNC_PARAMS = TParametersProjectEditeTag[0]> = {
    type: "project edite tag";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
};

/**
 *  тип обьекта для выполнения addNewComponentToNote в воркере
 */
type TMessageAddNewComponentToNoteOnWorker<FUNC_PARAMS = TParametersAddNewComponentToNote[0]> = {
    type: "add new component to note";
} & {
    [K in keyof FUNC_PARAMS]: FUNC_PARAMS[K];
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
    TMessageUpdateNoteComponentTextSettingsOnWorker,
    TMessageUpdateNoteComponentListSettingsOnWorker,
    TMessageUpdateNoteComponentHeaderSettingsOnWorker,
    TMessageUpdateNoteComponentCodeSettingsOnWorker,
    TMessageUpdateNodeCompletedOnWorker,
    TMessageUpdateNodeNameOnWorker,
    TMessageAddNodeToOnWorker,
    TMessageNodeMuveToOnWorker,
    TMessageNoteDeleteTagOnWorker,
    TMessageNoteAddTagOnWorker,
    TMessageProjectDeleteTagOnWorker,
    TMessageGetParentNodeOnWorker,
    TMessageProjectEditeTagOnWorker,
    TMessageAddNewComponentToNoteOnWorker,
};
