import { Operations } from '../Operation';
import { Computeds } from '../Computed';
export declare const EntityOperations: Operations;
export declare const EntityComputeds: Computeds;
export declare const EntityOps: {
    newInstance: import("../Operation").Operation<"name", never, never, never, "name">;
    get: import("../Operation").Operation<"name", "where", "instance", "where", "name">;
    getKey: import("../Operation").Operation<"name" | "instance", never, never, never, "name">;
    save: import("../Operation").Operation<"name" | "instance", never, never, never, "name">;
    remove: import("../Operation").Operation<"name" | "instance", never, never, never, "name">;
    setRelated: import("../Operation").Operation<"name" | "instance" | "related" | "relation", never, never, never, "name" | "relation">;
    addRelated: import("../Operation").Operation<"name" | "instance" | "related" | "relation", never, never, never, "name" | "relation">;
    removeRelated: import("../Operation").Operation<"name" | "instance" | "related" | "relation", never, never, never, "name" | "relation">;
    clearRelated: import("../Operation").Operation<"name" | "instance" | "relation", never, never, never, "name" | "relation">;
    getRelated: import("../Operation").Operation<"name" | "instance" | "relation", never, never, never, "name" | "relation">;
    isRelated: import("../Operation").Operation<"name" | "instance" | "related" | "relation", never, never, never, "name" | "relation">;
};
