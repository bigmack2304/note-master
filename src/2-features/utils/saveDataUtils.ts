import type { IDataTreeFolder, TchildrenType } from "0-shared/types/dataSave";
// разные вспомогательные функции для работы с tempData в indexedDB

// возвращает обьект TchildrenType без поля children
function nodeWithoutChildren(node: TchildrenType) {
  let obj: any = {};

  for (let elem in node) {
    if (elem === "children") continue;
    obj[elem] = node[elem as keyof typeof node];
  }
  return obj as TchildrenType;
}

export { nodeWithoutChildren };
