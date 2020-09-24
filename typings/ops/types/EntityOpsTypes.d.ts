export declare const EntityOpsTypes: {
    newInstance: import("../../Operation").OperationTypes<"name", "initial", never>;
    get: import("../../Operation").OperationTypes<"name", "where", "instance">;
    getKey: import("../../Operation").OperationTypes<"instance" | "name", never, never>;
    save: import("../../Operation").OperationTypes<"instance" | "name", never, never>;
    remove: import("../../Operation").OperationTypes<"instance" | "name", never, never>;
    setRelated: import("../../Operation").OperationTypes<"instance" | "name" | "relation" | "related", never, never>;
    addRelated: import("../../Operation").OperationTypes<"instance" | "name" | "relation" | "related", never, never>;
    removeRelated: import("../../Operation").OperationTypes<"instance" | "name" | "relation" | "related", never, never>;
    clearRelated: import("../../Operation").OperationTypes<"instance" | "name" | "relation", never, never>;
    getRelated: import("../../Operation").OperationTypes<"instance" | "name" | "relation", never, never>;
    isRelated: import("../../Operation").OperationTypes<"instance" | "name" | "relation" | "related", never, never>;
};
