import { Operations } from '../Operation';
import { Computeds } from '../Computed';
export declare const SetOperations: Operations;
export declare const SetComputeds: Computeds;
export declare const SetOps: {
    create: import("../Operation").Operation<never, never, never, never, never>;
    createLike: import("../Operation").Operation<"set", never, never, never, "set">;
    createFor: import("../Operation").Operation<"value", never, never, never, "value">;
    maybe: import("../Operation").Operation<"value", never, never, never, never>;
    add: import("../Operation").Operation<"value" | "set", never, never, never, "set">;
    has: import("../Operation").Operation<"value" | "set", never, never, never, never>;
    delete: import("../Operation").Operation<"value" | "set", never, never, never, never>;
    values: import("../Operation").Operation<"set", never, never, never, "set">;
    clear: import("../Operation").Operation<"set", never, never, never, "set">;
    count: import("../Operation").Operation<"set", never, never, never, never>;
    cmp: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    copy: import("../Operation").Operation<"set", "deepCopy", "value" | "set", "deepCopy", "set">;
    map: import("../Operation").Operation<"set", "transform", "value" | "set", "transform", "set">;
    isValid: import("../Operation").Operation<"value", never, never, never, never>;
    isEqual: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    isNotEqual: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    isLess: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    isLessOrEqual: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    isGreater: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    isGreaterOrEqual: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    asAny: import("../Operation").Operation<"value", never, never, never, never>;
    asBoolean: import("../Operation").Operation<"value", never, never, never, never>;
    asColor: import("../Operation").Operation<"value", never, never, never, never>;
    asDate: import("../Operation").Operation<"value", never, never, never, never>;
    asList: import("../Operation").Operation<"value", never, never, never, never>;
    asMap: import("../Operation").Operation<"value", never, never, never, never>;
    asNumber: import("../Operation").Operation<"value", never, never, never, never>;
    asObject: import("../Operation").Operation<"value", never, never, never, never>;
    asText: import("../Operation").Operation<"value", never, never, never, never>;
    asTuple: import("../Operation").Operation<"value", never, never, never, never>;
    asSet: import("../Operation").Operation<"value", never, never, never, never>;
};
