import { Operations } from '../Operation';
import { Computeds } from '../Computed';
export declare const AliasedOperations: Operations;
export declare const AliasedComputeds: Computeds;
export declare const AliasedOps: {
    newInstance: import("../Operation").Operation<"name", never, never, never, "name">;
    getKey: import("../Operation").Operation<"name" | "instance", never, never, never, "name">;
    save: import("../Operation").Operation<"name" | "instance", never, never, never, "name">;
    remove: import("../Operation").Operation<"name" | "instance", never, never, never, "name">;
    setRelated: import("../Operation").Operation<"name" | "related" | "instance" | "relation", never, never, never, "name" | "relation">;
    addRelated: import("../Operation").Operation<"name" | "related" | "instance" | "relation", never, never, never, "name" | "relation">;
    removeRelated: import("../Operation").Operation<"name" | "related" | "instance" | "relation", never, never, never, "name" | "relation">;
    clearRelated: import("../Operation").Operation<"name" | "instance" | "relation", never, never, never, "name" | "relation">;
    getRelated: import("../Operation").Operation<"name" | "instance" | "relation", never, never, never, "name" | "relation">;
    isRelated: import("../Operation").Operation<"name" | "related" | "instance" | "relation", never, never, never, "name" | "relation">;
};
