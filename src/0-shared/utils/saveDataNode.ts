import { savedIdGenerator } from "0-shared/utils/idGenerator";
import type { IDataTreeNode, TNodeType } from "0-shared/types/dataSave";

/**
 *  базовый класс для создания новых нод в дереве IDataTreeRootFolder
 */
class DataNode implements IDataTreeNode {
    public id: string;
    public type: TNodeType;

    constructor(type: TNodeType) {
        const insIdGenerator = savedIdGenerator.instatnceIdGenerator;
        if (!insIdGenerator) throw new Error("IdGenerator is not defined");

        this.id = insIdGenerator.generateId();
        this.type = type;
    }
}

export { DataNode };
