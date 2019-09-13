export declare const ObjectOps: {
    create: import("..").Operation<never, never, never>;
    has: import("..").Operation<"object" | "key", never, never>;
    get: import("..").Operation<"object" | "key", never, never>;
    set: import("..").Operation<"object" | "key" | "value", any, "existingValue">;
    delete: import("..").Operation<"object" | "key", never, never>;
    cmp: import("..").Operation<"value" | "test", never, never>;
    copy: import("..").Operation<"object", never, never>;
    isEqual: import("..").Operation<"value" | "test", never, never>;
    isNotEqual: import("..").Operation<"value" | "test", never, never>;
    isLess: import("..").Operation<"value" | "test", never, never>;
    isLessOrEqual: import("..").Operation<"value" | "test", never, never>;
    isGreater: import("..").Operation<"value" | "test", never, never>;
    isGreaterOrEqual: import("..").Operation<"value" | "test", never, never>;
    asAny: import("..").Operation<"value", never, never>;
    asBoolean: import("..").Operation<"value", never, never>;
    asDate: import("..").Operation<"value", never, never>;
    asList: import("..").Operation<"value", never, never>;
    asMap: import("..").Operation<"value", never, never>;
    asNumber: import("..").Operation<"value", never, never>;
    asObject: import("..").Operation<"value", never, never>;
    asText: import("..").Operation<"value", never, never>;
    asTuple: import("..").Operation<"value", never, never>;
};
