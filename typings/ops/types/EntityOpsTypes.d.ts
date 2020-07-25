export declare const EntityOpsTypes: {
    newInstance: import("../../Operation").OperationTypes<"name", "initial", never>;
    get: import("../../Operation").OperationTypes<"name", "where", "instance">;
    getKey: import("../../Operation").OperationTypes<"name" | "instance", never, never>;
    save: import("../../Operation").OperationTypes<"name" | "instance", never, never>;
    remove: import("../../Operation").OperationTypes<"name" | "instance", never, never>;
    setRelated: import("../../Operation").OperationTypes<"name" | "instance" | "relation" | "related", never, never>;
    addRelated: import("../../Operation").OperationTypes<"name" | "instance" | "relation" | "related", never, never>;
    removeRelated: import("../../Operation").OperationTypes<"name" | "instance" | "relation" | "related", never, never>;
    clearRelated: import("../../Operation").OperationTypes<"name" | "instance" | "relation", never, never>;
    getRelated: import("../../Operation").OperationTypes<"name" | "instance" | "relation", never, never>;
    isRelated: import("../../Operation").OperationTypes<"name" | "instance" | "relation" | "related", never, never>;
};
