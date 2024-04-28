import { savedIdGenerator } from "0-shared/utils/idGenerator";
import { IdGenerator } from "0-shared/utils/idGenerator";
import type { IDataTreeNode, TNodeType } from "0-shared/types/dataSave";

/**
 *
 *  базовый класс для создания новых нод в дереве IDataTreeRootFolder
 */
class DataNode implements IDataTreeNode {
    public id: string;
    public type: TNodeType;

    constructor(type: TNodeType, idGenerator?: InstanceType<typeof IdGenerator>) {
        const insIdGenerator = !idGenerator ? savedIdGenerator.instatnceIdGenerator : idGenerator;
        if (!insIdGenerator) throw new Error("IdGenerator is not defined");

        this.id = insIdGenerator.generateId();
        this.type = type;

        Object.setPrototypeOf(this, null);
    }
}

export { DataNode };
