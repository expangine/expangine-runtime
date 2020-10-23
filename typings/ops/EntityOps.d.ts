import { Operations } from '../Operation';
import { Computeds } from '../Computed';
export declare const EntityOperations: Operations;
export declare const EntityComputeds: Computeds;
export declare const EntityOps: {
    newInstance: import("../Operation").OperationResolved<"name", "initial", any, any, "name">;
    get: import("../Operation").OperationResolved<"name", "where", "instance", "where", "name">;
    getKey: import("../Operation").OperationResolved<"name" | "instance", any, any, any, "name">;
    save: import("../Operation").OperationResolved<"name" | "instance", any, any, any, "name">;
    remove: import("../Operation").OperationResolved<"name" | "instance", any, any, any, "name">;
    setRelated: import("../Operation").OperationResolved<"name" | "related" | "instance" | "relation", any, any, any, "relation" | "name">;
    addRelated: import("../Operation").OperationResolved<"name" | "related" | "instance" | "relation", any, any, any, "relation" | "name">;
    removeRelated: import("../Operation").OperationResolved<"name" | "related" | "instance" | "relation", any, any, any, "relation" | "name">;
    clearRelated: import("../Operation").OperationResolved<"name" | "instance" | "relation", any, any, any, "relation" | "name">;
    getRelated: import("../Operation").OperationResolved<"name" | "instance" | "relation", any, any, any, "relation" | "name">;
    isRelated: import("../Operation").OperationResolved<"name" | "related" | "instance" | "relation", any, any, any, "relation" | "name">;
};
