import { getNodeById } from "./saveDataParse";
import { setTempDataDB, getTempDataDB } from "./appIndexedDB";
import type {
  TchildrenType,
  TNoteBody,
  IDataSave,
  IDataTreeNote,
} from "0-shared/types/dataSave";

// функции для применения изменений к tempData в indexedDB

// слияние нод по id, tempData с newNode
async function mergeNodeById(newNode: TchildrenType) {
  const target_id = newNode.id;

  const onGetNode = (
    node: TchildrenType | TNoteBody | null,
    allTempData: IDataSave
  ) => {
    if (node) {
      Object.assign(node, newNode);
      setTempDataDB({ value: allTempData });
    }
  };

  getTempDataDB({
    callback(value) {
      if (!value) return;
      let findResult = getNodeById(value, target_id);
      onGetNode(findResult, value);
    },
  });
}

// слияние ноды в сторе и отредактированной заметки
function updateNodeValue(
  note: IDataTreeNote,
  target_id: string,
  newValue: string
) {
  const cloneNode = JSON.parse(JSON.stringify(note)) as IDataTreeNote;

  for (let component of cloneNode.body) {
    if (component.id !== target_id) continue;
    component.value = newValue;
  }

  return cloneNode;
}

export { mergeNodeById, updateNodeValue };
