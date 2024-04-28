import {
    isFunctionData,
    isDelByIdData,
    isDelCompInNote,
    isCloneFiltredTree,
    isUpdateNodeValue,
    isUpdNoteComponentsOrder,
    isUpdateNodeImage,
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
    isNoteDeleteTag,
    isNoteAddTag,
    isProjectDeleteTag,
    isGetParentNode,
    isProjectEditeTag,
    isAddNewComponentToNote,
} from "0-shared/utils/typeHelpers";
import { deleteById } from "2-features/utils/saveDataEditFunctions/deleteById";
import { deleteComponentInNote } from "2-features/utils/saveDataEditFunctions/deleteComponentInNote";
import { cloneFiltredTree } from "0-shared/utils/note_find";
import { updateNodeValue } from "2-features/utils/saveDataEditFunctions/updateNoteValue";
import { updNoteComponentsOrder } from "2-features/utils/saveDataEditFunctions/updNoteComponentsOrder";
import { updateNodeImage } from "2-features/utils/saveDataEditFunctions/updateNoteImage";
import { updateNodeTable } from "2-features/utils/saveDataEditFunctions/updateNodeTable";
import { updateNodeTableSettings } from "2-features/utils/saveDataEditFunctions/updateNodeTableSettings";
import { updateNodeLink } from "2-features/utils/saveDataEditFunctions/updateNodeLink";
import { getNodeById } from "2-features/utils/saveDataParseFunctions/getNodeById";
import { updateNoteComponentLinkSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentLinkSettings";
import { updateNoteComponentImageSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentImageSettings";
import { updateNoteComponentTextSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentTextSettings";
import { updateNoteComponentListSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentListSettings";
import { updateNoteComponentHeaderSettings } from "2-features/utils/saveDataEditFunctions/updateNoteComponentHeaderSettings";
import { updateNoteComponentCodeSettings } from "2-features/utils/saveDataEditFunctions/componentCodeSettings";
import { updateNodeCompleted } from "2-features/utils/saveDataEditFunctions/updateNodeCompleted";
import { updateNodeName } from "2-features/utils/saveDataEditFunctions/updateNodeName";
import { addNodeTo } from "2-features/utils/saveDataEditFunctions/addNodeTo";
import { nodeMuveTo } from "2-features/utils/saveDataEditFunctions/nodeMuveTo";
import { noteDeleteTag } from "2-features/utils/saveDataEditFunctions/noteDeleteTag";
import { noteAddTag } from "2-features/utils/saveDataEditFunctions/noteAddTag";
import { projectDeleteTag } from "2-features/utils/saveDataEditFunctions/projectDeleteTag";
import { getParentNode } from "2-features/utils/saveDataParseFunctions/getParentNode";
import { projectEditeTag } from "2-features/utils/saveDataEditFunctions/projectEditeTag";
import { addNewComponentToNote } from "2-features/utils/saveDataEditFunctions/addNewComponentToNote";
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
    TMessageGetParentNodeOnWorker,
    TMessageProjectEditeTagOnWorker,
    TMessageAddNewComponentToNoteOnWorker,
} from "./workerTypes";

type TTaskRunerTypes =
    | TMessageDelById
    | TMessageDelCompInNote
    | TMessageCloneFiltredTreeOnWorker
    | TMessageUpdateNodeValueOnWorker
    | TMessageUpdNoteComponentsOrderOnWorker
    | TMessageUpdateNodeImageOnWorker
    | TMessageUpdateNodeTableOnWorker
    | TMessageUpdateNodeTableSettingsOnWorker
    | TMessageUpdateNodeLinkOnWorker
    | TMessageGetNodeByIdOnWorker
    | TMessageUpdateNoteComponentLinkSettingsOnWorker
    | TMessageUpdateNoteComponentImageSettingsOnWorker
    | TMessageUpdateNoteComponentTextSettingsOnWorker
    | TMessageUpdateNoteComponentListSettingsOnWorker
    | TMessageUpdateNoteComponentHeaderSettingsOnWorker
    | TMessageUpdateNoteComponentCodeSettingsOnWorker
    | TMessageUpdateNodeCompletedOnWorker
    | TMessageUpdateNodeNameOnWorker
    | TMessageAddNodeToOnWorker
    | TMessageNodeMuveToOnWorker
    | TMessageNoteDeleteTagOnWorker
    | TMessageNoteAddTagOnWorker
    | TMessageProjectDeleteTagOnWorker
    | TMessageGetParentNodeOnWorker
    | TMessageProjectEditeTagOnWorker
    | TMessageAddNewComponentToNoteOnWorker;

/**
 * получение данных
 */
//eslint-disable-next-line
self.onmessage = (e: MessageEvent) => {
    const data = e.data;
    if (!data) return;

    if (isFunctionData(data)) {
        funcExecutorCase(data);
        return;
    }

    if (
        isUpdateNoteComponentImageSettings(data) ||
        isUpdateNoteComponentLinkSettings(data) ||
        isGetNodeById(data) ||
        isUpdateNodeLink(data) ||
        isUpdateNodeTableSettings(data) ||
        isUpdateNodeTable(data) ||
        isUpdateNodeImage(data) ||
        isUpdNoteComponentsOrder(data) ||
        isUpdateNodeValue(data) ||
        isCloneFiltredTree(data) ||
        isDelCompInNote(data) ||
        isDelByIdData(data) ||
        isUpdateNoteComponentTextSettings(data) ||
        isUpdateNoteComponentListSettings(data) ||
        isUpdateNoteComponentHeaderSettings(data) ||
        isUpdateNoteComponentCodeSettings(data) ||
        isUpdateNodeCompleted(data) ||
        isUpdateNodeName(data) ||
        isAddNodeTo(data) ||
        isNodeMuveTo(data) ||
        isNoteDeleteTag(data) ||
        isNoteAddTag(data) ||
        isProjectDeleteTag(data) ||
        isGetParentNode(data) ||
        isProjectEditeTag(data) ||
        isAddNewComponentToNote(data)
    ) {
        taskRuner(data);
        return;
    }
};

/**
 * отправка данных в рантайм
 */
function worker_postMessage(resolve: string = "", work_data: any = null) {
    //eslint-disable-next-line
    self.postMessage({
        resolve: resolve,
        work_data: work_data,
    });
}

/**
 * кейс с выполнением функции
 */
function funcExecutorCase({ argument_names = [], argument_values = [], func_data = "" }: TMessageDataType) {
    if (func_data) {
        worker_postMessage("Function executor: started");
        func_runer(argument_names, argument_values, func_data);
    }
}

/**
 * создание и выполнение полученной функции
 */
function func_runer(argument_names: string[], argument_values: any[], func_data: string) {
    try {
        const func = new Function(...argument_names, func_data);
        const result = func(...argument_values);
        worker_postMessage("Function executor: finished", result);
    } catch (e) {
        worker_postMessage("Function executor: error");
        console.error(e);
    }
}

async function taskRuner(data: TTaskRunerTypes) {
    try {
        worker_postMessage(`${data.type}: started`);
        console.info(`dedicatedWorker.taskRuner: type '${data.type}'`);
        let result: any = undefined;

        switch (data.type) {
            case "update note component image settings":
                result = await updateNoteComponentImageSettings(data);
                break;
            case "clone filtred tree":
                result = await cloneFiltredTree(...data.args);
                break;
            case "delete by id":
                result = await deleteById(data);
                break;
            case "delete component in note":
                result = await deleteComponentInNote(data);
                break;
            case "get node by id":
                result = getNodeById(...data.args);
                break;
            case "update Note component link settings":
                result = await updateNoteComponentLinkSettings(data);
                break;
            case "update node image":
                result = await updateNodeImage(data);
                break;
            case "update node link":
                result = await updateNodeLink(data);
                break;
            case "update node table":
                result = await updateNodeTable(data);
                break;
            case "update node table settings":
                result = await updateNodeTableSettings(data);
                break;
            case "update node value":
                result = await updateNodeValue(data);
                break;
            case "update note components order":
                result = await updNoteComponentsOrder(data);
                break;
            case "update note component text settings":
                result = await updateNoteComponentTextSettings(data);
                break;
            case "update note component list settings":
                result = await updateNoteComponentListSettings(data);
                break;
            case "update note component header settings":
                result = await updateNoteComponentHeaderSettings(data);
                break;
            case "update note component code settings":
                result = await updateNoteComponentCodeSettings(data);
                break;
            case "update node completed":
                result = await updateNodeCompleted(data);
                break;
            case "update node name":
                result = await updateNodeName(data);
                break;
            case "add node to":
                result = await addNodeTo(data);
                break;
            case "node move to":
                result = await nodeMuveTo(data);
                break;
            case "note delete tag":
                result = await noteDeleteTag(data);
                break;
            case "note add tag":
                result = await noteAddTag(data);
                break;
            case "project delete tag":
                result = await projectDeleteTag(data);
                break;
            case "get parent node":
                result = await getParentNode(...data.args);
                break;
            case "project edite tag":
                result = await projectEditeTag(data);
                break;
            case "add new component to note":
                result = await addNewComponentToNote(data);
                break;
            default:
                console.error(`dedicatedWorker.taskRuner: task type error, task '${(data as any).type}' unknown`);
                throw new Error();
        }

        worker_postMessage(`${data.type}: finished`, result);
    } catch (e) {
        worker_postMessage(`${data.type}: error`);
        console.error(e);
    }
}
