import { Operations } from '../Operation';
import { Computeds } from '../Computed';
export declare const ObjectOperations: Operations;
export declare const ObjectComputeds: Computeds;
export declare const ObjectOps: {
    create: import("../Operation").OperationResolved<never, never, never, never, never>;
    maybe: import("../Operation").OperationResolved<"value", never, never, never, never>;
    has: import("../Operation").OperationResolved<"object" | "key", never, never, never, never>;
    get: import("../Operation").OperationResolved<"object" | "key", never, never, never, never>;
    set: import("../Operation").OperationResolved<"object" | "value" | "key", never, "existingValue", never, "object">;
    delete: import("../Operation").OperationResolved<"object" | "key", never, never, never, never>;
    cmp: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    copy: import("../Operation").OperationResolved<"object", never, never, never, "object">;
    merge: import("../Operation").OperationResolved<"b" | "a", "c" | "d" | "e", never, never, "a" | "b" | "c" | "d" | "e">;
    isValid: import("../Operation").OperationResolved<"value", never, never, never, never>;
    isEqual: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    isNotEqual: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    isLess: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    isLessOrEqual: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    isGreater: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    isGreaterOrEqual: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    asAny: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asBoolean: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asColor: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asDate: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asList: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asMap: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asNumber: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asObject: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asText: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asTuple: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asSet: import("../Operation").OperationResolved<"value", never, never, never, never>;
};
