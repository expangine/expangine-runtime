import { Operations } from '../Operation';
import { Computeds } from '../Computed';
export declare const EntityOperations: Operations;
export declare const EntityComputeds: Computeds;
export declare const EntityOps: {
    newInstance: import("../Operation").OperationResolved<"name", "initial", never, never, "name">;
    get: import("../Operation").OperationResolved<"name", "where", "instance", "where", "name">;
    getKey: import("../Operation").OperationResolved<"name" | "instance", never, never, never, "name">;
    save: import("../Operation").OperationResolved<"name" | "instance", never, never, never, "name">;
    remove: import("../Operation").OperationResolved<"name" | "instance", never, never, never, "name">;
    setRelated: import("../Operation").OperationResolved<"name" | "related" | "instance" | "relation", never, never, never, "name" | "relation">;
    addRelated: import("../Operation").OperationResolved<"name" | "related" | "instance" | "relation", never, never, never, "name" | "relation">;
    removeRelated: import("../Operation").OperationResolved<"name" | "related" | "instance" | "relation", never, never, never, "name" | "relation">;
    clearRelated: import("../Operation").OperationResolved<"name" | "instance" | "relation", never, never, never, "name" | "relation">;
    getRelated: import("../Operation").OperationResolved<"name" | "instance" | "relation", never, never, never, "name" | "relation">;
    isRelated: import("../Operation").OperationResolved<"name" | "related" | "instance" | "relation", never, never, never, "name" | "relation">;
};
