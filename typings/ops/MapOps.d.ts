import { Operations } from '../Operation';
import { Computeds } from '../Computed';
export declare const MapOperations: Operations;
export declare const MapComputeds: Computeds;
export declare const MapOps: {
    create: import("../Operation").OperationResolved<never, never, never, never, never>;
    createLike: import("../Operation").OperationResolved<"map", any, any, any, "map">;
    createFor: import("../Operation").OperationResolved<"value", "key", any, any, "value" | "key">;
    maybe: import("../Operation").OperationResolved<"value", never, never, never, never>;
    get: import("../Operation").OperationResolved<"map" | "key", any, any, any, "map">;
    set: import("../Operation").OperationResolved<"map" | "value" | "key", any, "existingValue", "value", "map">;
    has: import("../Operation").OperationResolved<"map" | "key", never, never, never, never>;
    delete: import("../Operation").OperationResolved<"map" | "key", never, never, never, never>;
    keys: import("../Operation").OperationResolved<"map", any, any, any, "map">;
    values: import("../Operation").OperationResolved<"map", any, any, any, "map">;
    entries: import("../Operation").OperationResolved<"map", any, any, any, "map">;
    pairs: import("../Operation").OperationResolved<"map", any, any, any, "map">;
    clear: import("../Operation").OperationResolved<"map", any, any, any, "map">;
    count: import("../Operation").OperationResolved<"map", never, never, never, never>;
    cmp: import("../Operation").OperationResolved<"value" | "test" | "compare", any, "value" | "key" | "test", "compare", never>;
    copy: import("../Operation").OperationResolved<"map", "deepCopy" | "deepCopyKey", "map" | "value" | "key", "deepCopy" | "deepCopyKey", "map">;
    map: import("../Operation").OperationResolved<"map", "transform" | "transformKey", "map" | "value" | "key", "transform" | "transformKey", "map">;
    toPlainObject: import("../Operation").OperationResolved<"map", never, never, never, never>;
    fromPlainObject: import("../Operation").OperationResolved<"object", any, any, any, "object">;
    isValid: import("../Operation").OperationResolved<"value", never, never, never, never>;
    isEqual: import("../Operation").OperationResolved<"value" | "test" | "isEqual", any, "value" | "key" | "test", "isEqual", never>;
    isNotEqual: import("../Operation").OperationResolved<"value" | "test" | "isEqual", any, "value" | "key" | "test", "isEqual", never>;
    isLess: import("../Operation").OperationResolved<"value" | "test" | "compare", any, "value" | "key" | "test", "compare", never>;
    isLessOrEqual: import("../Operation").OperationResolved<"value" | "test" | "compare", any, "value" | "key" | "test", "compare", never>;
    isGreater: import("../Operation").OperationResolved<"value" | "test" | "compare", any, "value" | "key" | "test", "compare", never>;
    isGreaterOrEqual: import("../Operation").OperationResolved<"value" | "test" | "compare", any, "value" | "key" | "test", "compare", never>;
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
