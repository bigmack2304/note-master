import { ForwardRefRenderFunction } from "react";
import type { IDataTreeNote, IDataTreeFolder, TNoteBody, IDataSave, IGlobalTag } from "0-shared/types/dataSave";
import type {
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
} from "0-shared/dedicatedWorker/workerTypes";
import type { TTableValue } from "0-shared/types/dataSave";

/**
 *  убирает своиство readonly у полей массива или обьекта
 */
type RemoveReadonly<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
 * вычисляет пропсы компонента
 * @tparam T - тип компонента
 */
type GetProps<T> = T extends React.ComponentType<infer Props> ? Props : unknown;

/**
 * типизирует параметр ref в компоненте, если используется forwardRef
 * @tparam T - тип элемента на который перенаправляется ref (например HTMLInputElement)
 */
type Ref<T> = Parameters<ForwardRefRenderFunction<T>>[1];

/**
 * преобразует массив от Parameters<> в обьект, где, K будет массивом ключей
 * @tparam T - массив возвращенный дженериком Parameters
 * @tparam K - массив ключей, которые будут присвоины типам с соответствующими индексами в T
 */
type TupleToObject<T extends any[], K extends { [I in keyof T]: PropertyKey }> = {
    [I in keyof T as I extends keyof any[] ? never : K[I]]: T[I];
};

function isTGlobalTag(value: any): value is IGlobalTag {
    if (typeof value !== "object") return false;
    if (!("tag_name" in value) || ("tag_name" in value && typeof value.tag_name !== "string")) return false;
    if (!("color" in value) || ("color" in value && typeof value.color !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу IDataTreeNote
 * @param node
 * @returns boolean
 */
function isDataTreeNote(node: any): node is IDataTreeNote {
    if (typeof node !== "object") return false;
    if (!("type" in node)) return false;
    return node.type === "note";
}

/**
 * проверяет чтобы сущьность пренадлежала к типу IDataTreeFolder
 * @param node
 * @returns boolean
 */
function isDataTreeFolder(node: any): node is IDataTreeFolder {
    if (typeof node !== "object") return false;
    if (!("type" in node)) return false;
    return node.type === "folder";
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TTableValue
 * @returns boolean
 */
function isTableValue(value: any): value is TTableValue {
    if (typeof value !== "object") return false;
    if (!("headers" in value) || ("headers" in value && !Array.isArray(value.headers))) return false;
    if (!("rows" in value) || ("rows" in value && !Array.isArray(value.rows))) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TNoteBody
 * @param node
 * @returns boolean
 */
function isDataNoteBody(node: any): node is TNoteBody {
    if (typeof node !== "object") return false;
    if (!("type" in node)) return false;
    return node.type === "component";
}

/**
 * проверяет чтобы сущьность пренадлежала к типу IDataSave
 * @param node
 * @returns boolean
 */
function isDataSave(node: any): node is IDataSave {
    if (typeof node !== "object") return false;
    if (!("db_type" in node)) return false;
    if (!("data_tree" in node)) return false;
    if (!("global_tags" in node)) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageDataType dedicated воркера
 */
function isFunctionData(value: any): value is TMessageDataType {
    if (typeof value !== "object") return false;
    if (!("argument_names" in value)) return false;
    if (!("argument_values" in value)) return false;
    if (!("func_data" in value)) return false;
    if (!("type" in value) || ("type" in value && value.type !== "function executor")) return false;
    if (!Array.isArray(value.argument_names)) return false;
    if (!Array.isArray(value.argument_values)) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageDelById dedicated воркера
 */
function isDelByIdData(value: any): value is TMessageDelById {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "delete by id")) return false;
    if (!("rootNode" in value) || ("rootNode" in value && !isDataTreeFolder(value.rootNode))) return false;
    if (!("target_id" in value) || ("target_id" in value && typeof value.target_id !== "string")) return false;
    if (!("savedIdGenerator" in value) || ("savedIdGenerator" in value && !Array.isArray(value.savedIdGenerator))) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageDelCompInNote dedicated воркера
 */
function isDelCompInNote(value: any): value is TMessageDelCompInNote {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "delete component in note")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("componentID" in value) || ("componentID" in value && typeof value.componentID !== "string")) return false;
    if (!("savedIdGenerator" in value) || ("savedIdGenerator" in value && !Array.isArray(value.savedIdGenerator))) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageDelCompInNote dedicated воркера
 */
function isCloneFiltredTree(value: any): value is TMessageCloneFiltredTreeOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "clone filtred tree")) return false;
    if (!("orig_obj" in value) || ("orig_obj" in value && !isDataTreeFolder(value.orig_obj))) return false;
    if (!("filtres" in value)) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNodeValueOnWorker dedicated воркера
 */
function isUpdateNodeValue(value: any): value is TMessageUpdateNodeValueOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node value")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("newValue" in value) || ("newValue" in value && typeof value.newValue !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdNoteComponentsOrderOnWorker dedicated воркера
 */
function isUpdNoteComponentsOrder(value: any): value is TMessageUpdNoteComponentsOrderOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update note components order")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentDragId" in value) || ("componentDragId" in value && typeof value.componentDragId !== "string")) return false;
    if (!("toComponentDragId" in value) || ("toComponentDragId" in value && typeof value.toComponentDragId !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdNoteComponentsOrderOnWorker dedicated воркера
 */
function isUpdateNodeImage(value: any): value is TMessageUpdateNodeImageOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node image")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("newName" in value) || ("newName" in value && typeof value.newName !== "string")) return false;
    if (!("newSrc" in value) || ("newSrc" in value && typeof value.newSrc !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNodeTableOnWorker dedicated воркера
 */
function isUpdateNodeTable(value: any): value is TMessageUpdateNodeTableOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node table")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("newValue" in value) || ("newValue" in value && !isTableValue(value.newValue))) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNodeTableSettingsOnWorker dedicated воркера
 */
function isUpdateNodeTableSettings(value: any): value is TMessageUpdateNodeTableSettingsOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node table settings")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("backlight" in value) || ("backlight" in value && typeof value.backlight !== "boolean")) return false;
    if (!("desc" in value) || ("desc" in value && typeof value.desc !== "string")) return false;
    if (!("viewButtons" in value) || ("viewButtons" in value && typeof value.viewButtons !== "boolean")) return false;
    if (!("aligin" in value) || ("aligin" in value && typeof value.aligin !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNodeLinkOnWorker dedicated воркера
 */
function isUpdateNodeLink(value: any): value is TMessageUpdateNodeLinkOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node link")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("target" in value) || ("target" in value && typeof value.target !== "string")) return false;
    if (!("value" in value) || ("value" in value && typeof value.value !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageGetNodeByIdOnWorker dedicated воркера
 */
function isGetNodeById(value: any): value is TMessageGetNodeByIdOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "get node by id")) return false;
    if (!("args" in value) || ("args" in value && !Array.isArray(value.args))) return false;
    if (value.args.length < 2) return false;
    if (!isDataTreeFolder(value.args[0])) return false;
    if (typeof value.args[1] !== "string") return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNoteComponentLinkSettingsOnWorker dedicated воркера
 */
function isUpdateNoteComponentLinkSettings(value: any): value is TMessageUpdateNoteComponentLinkSettingsOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update Note component link settings")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("isLabel" in value) || ("isLabel" in value && typeof value.isLabel !== "boolean")) return false;
    if (!("isBg" in value) || ("isBg" in value && typeof value.isBg !== "boolean")) return false;
    if (!("labelVal" in value) || ("labelVal" in value && typeof value.labelVal !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNoteComponentImageSettingsOnWorker dedicated воркера
 */
function isUpdateNoteComponentImageSettings(value: any): value is TMessageUpdateNoteComponentImageSettingsOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update note component image settings")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("imageDesc" in value) || ("imageDesc" in value && typeof value.imageDesc !== "string")) return false;
    if (!("isDescHidden" in value) || ("isDescHidden" in value && typeof value.isDescHidden !== "boolean")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNoteComponentTextSettingsOnWorker dedicated воркера
 */
function isUpdateNoteComponentTextSettings(value: any): value is TMessageUpdateNoteComponentTextSettingsOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update note component text settings")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("textBackground" in value) || ("textBackground" in value && typeof value.textBackground !== "boolean")) return false;
    if (!("textFormat" in value) || ("textFormat" in value && typeof value.textFormat !== "boolean")) return false;
    if (!("fontValue" in value) || ("fontValue" in value && typeof value.fontValue !== "string")) return false;
    if (!("lineBreak" in value) || ("lineBreak" in value && typeof value.lineBreak !== "boolean")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNoteComponentListSettingsOnWorker dedicated воркера
 */
function isUpdateNoteComponentListSettings(value: any): value is TMessageUpdateNoteComponentListSettingsOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update note component list settings")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("listBg" in value) || ("listBg" in value && typeof value.listBg !== "boolean")) return false;
    if (!("isNumeric" in value) || ("isNumeric" in value && typeof value.isNumeric !== "boolean")) return false;
    if (!("aligin" in value) || ("aligin" in value && typeof value.aligin !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNoteComponentHeaderSettingsOnWorker dedicated воркера
 */
function isUpdateNoteComponentHeaderSettings(value: any): value is TMessageUpdateNoteComponentHeaderSettingsOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update note component header settings")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("componentId" in value) || ("componentId" in value && typeof value.componentId !== "string")) return false;
    if (!("textAligin" in value) || ("textAligin" in value && typeof value.textAligin !== "string")) return false;
    if (!("headerSize" in value) || ("headerSize" in value && typeof value.headerSize !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNoteComponentCodeSettingsOnWorker dedicated воркера
 */
function isUpdateNoteComponentCodeSettings(value: any): value is TMessageUpdateNoteComponentCodeSettingsOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update note component code settings")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("codeTheme" in value) || ("codeTheme" in value && typeof value.codeTheme !== "string")) return false;
    if (!("codeLanguage" in value) || ("codeLanguage" in value && typeof value.codeLanguage !== "string")) return false;
    if (!("isExpand" in value) || ("isExpand" in value && typeof value.isExpand !== "boolean")) return false;
    if (!("expandDesc" in value) || ("expandDesc" in value && typeof value.expandDesc !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNodeCompletedOnWorker dedicated воркера
 */
function isUpdateNodeCompleted(value: any): value is TMessageUpdateNodeCompletedOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node completed")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("noteId" in value) || ("noteId" in value && typeof value.noteId !== "string")) return false;
    if (!("newValue" in value) || ("newValue" in value && typeof value.newValue !== "boolean")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageUpdateNodeNameOnWorker dedicated воркера
 */
function isUpdateNodeName(value: any): value is TMessageUpdateNodeNameOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "update node name")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("target_id" in value) || ("target_id" in value && typeof value.target_id !== "string")) return false;
    if (!("newName" in value) || ("newName" in value && typeof value.newName !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageAddNodeToOnWorker dedicated воркера
 */
function isAddNodeTo(value: any): value is TMessageAddNodeToOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "add node to")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("insertToId" in value) || ("insertToId" in value && typeof value.insertToId !== "string")) return false;
    if (!("newNode" in value)) return false;
    if ("newNode" in value) {
        if (!isDataTreeNote(value.newNode) && !isDataTreeFolder(value.newNode) && !isDataNoteBody(value.newNode)) return false;
    }
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageNodeMuveToOnWorker dedicated воркера
 */
function isNodeMuveTo(value: any): value is TMessageNodeMuveToOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "node move to")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("muvedNodeID" in value) || ("muvedNodeID" in value && typeof value.muvedNodeID !== "string")) return false;
    if (!("muveToID" in value) || ("muveToID" in value && typeof value.muveToID !== "string")) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageNoteDeleteTagOnWorker dedicated воркера
 */
function isNoteDeleteTag(value: any): value is TMessageNoteDeleteTagOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "note delete tag")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("targetNoteID" in value) || ("targetNoteID" in value && typeof value.targetNoteID !== "string")) return false;
    if (!("tag" in value) || ("tag" in value && !isTGlobalTag(value.tag))) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageNoteAddTagOnWorker dedicated воркера
 */
function isNoteAddTag(value: any): value is TMessageNoteAddTagOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "note add tag")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("targetNoteID" in value) || ("targetNoteID" in value && typeof value.targetNoteID !== "string")) return false;
    if (!("tag" in value) || ("tag" in value && !(typeof value.tag === "string" || Array.isArray(value.tag)))) return false;
    return true;
}

/**
 * проверяет чтобы сущьность пренадлежала к типу TMessageProjectDeleteTagOnWorker dedicated воркера
 */
function isProjectDeleteTag(value: any): value is TMessageProjectDeleteTagOnWorker {
    if (typeof value !== "object") return false;
    if (!("type" in value) || ("type" in value && value.type !== "project delete tag")) return false;
    if (!("rootFolder" in value) || ("rootFolder" in value && !isDataTreeFolder(value.rootFolder))) return false;
    if (!("tagName" in value) || ("tagName" in value && typeof value.tagName !== "string")) return false;
    if (!("tagData" in value) || ("tagData" in value && !(typeof value.tagData === "object"))) return false;
    return true;
}

export {
    isDataTreeNote,
    isDataTreeFolder,
    isDataNoteBody,
    isDataSave,
    isFunctionData,
    isDelByIdData,
    isDelCompInNote,
    isCloneFiltredTree,
    isUpdateNodeValue,
    isUpdNoteComponentsOrder,
    isUpdateNodeImage,
    isTableValue,
    isUpdateNodeTable,
    isUpdateNodeTableSettings,
    isUpdateNodeLink,
    isGetNodeById,
    isUpdateNoteComponentLinkSettings,
    isUpdateNoteComponentImageSettings,
    isUpdateNoteComponentTextSettings,
    isUpdateNoteComponentListSettings,
    isUpdateNoteComponentHeaderSettings,
    isUpdateNoteComponentCodeSettings,
    isUpdateNodeCompleted,
    isUpdateNodeName,
    isAddNodeTo,
    isNodeMuveTo,
    isTGlobalTag,
    isNoteDeleteTag,
    isNoteAddTag,
    isProjectDeleteTag,
};
export type { GetProps, Ref, RemoveReadonly, TupleToObject };
