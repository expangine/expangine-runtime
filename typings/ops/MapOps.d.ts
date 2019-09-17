export declare const MapOps: {
    create: import("..").Operation<never, never, never>;
    get: import("..").Operation<"key" | "map", never, never>;
    set: import("..").Operation<"key" | "value" | "map", any, "existingValue">;
    has: import("..").Operation<"key" | "map", never, never>;
    delete: import("..").Operation<"key" | "map", never, never>;
    keys: import("..").Operation<"map", never, never>;
    values: import("..").Operation<"map", never, never>;
    entries: import("..").Operation<"map", never, never>;
    clear: import("..").Operation<"map", never, never>;
    count: import("..").Operation<"map", never, never>;
    cmp: import("..").Operation<"value" | "test" | "compare", any, "key" | "value" | "test">;
    copy: import("..").Operation<"map", "deepCopy" | "deepCopyKey", "key" | "value" | "map">;
    map: import("..").Operation<"map", "transform" | "transformKey", "key" | "value" | "map">;
    toPlainObject: import("..").Operation<"map", never, never>;
    isValid: import("..").Operation<"value", never, never>;
    isEqual: import("..").Operation<"value" | "test" | "isEqual", any, "key" | "value" | "test">;
    isNotEqual: import("..").Operation<"value" | "test" | "isEqual", any, "key" | "value" | "test">;
    isLess: import("..").Operation<"value" | "test" | "compare", any, "key" | "value" | "test">;
    isLessOrEqual: import("..").Operation<"value" | "test" | "compare", any, "key" | "value" | "test">;
    isGreater: import("..").Operation<"value" | "test" | "compare", any, "key" | "value" | "test">;
    isGreaterOrEqual: import("..").Operation<"value" | "test" | "compare", any, "key" | "value" | "test">;
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
