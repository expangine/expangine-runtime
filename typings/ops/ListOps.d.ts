export declare const ListOps: {
    create: import("..").Operation<never, never, never>;
    build: import("..").Operation<"item" | "count", "sameItem", "list" | "index" | "count" | "last">;
    get: import("..").Operation<"list" | "index", never, never>;
    set: import("..").Operation<"list" | "index" | "value", never, never>;
    add: import("..").Operation<"list" | "item", never, never>;
    addFirst: import("..").Operation<"list" | "item", never, never>;
    addLast: import("..").Operation<"list" | "item", never, never>;
    insert: import("..").Operation<"list" | "item" | "index", never, never>;
    remove: import("..").Operation<"list" | "item" | "isEqual", any, "list" | "value" | "test">;
    removeFirst: import("..").Operation<"list", never, never>;
    removeLast: import("..").Operation<"list", never, never>;
    removeAt: import("..").Operation<"list" | "index", never, never>;
    contains: import("..").Operation<"list" | "item" | "isEqual", any, "list" | "value" | "test">;
    copy: import("..").Operation<"list", "deepCopy", "copy">;
    reverse: import("..").Operation<"list", never, never>;
    exclude: import("..").Operation<"list" | "isEqual" | "exclude", any, "list" | "value" | "test">;
    overlap: import("..").Operation<"list" | "isEqual" | "overlap", any, "list" | "value" | "test">;
    sort: import("..").Operation<"list" | "compare", any, "list" | "value" | "test">;
    shuffle: import("..").Operation<"list", "times", never>;
    unique: import("..").Operation<"list" | "isEqual", any, "list" | "value" | "test">;
    duplicates: import("..").Operation<"list" | "isEqual", "once", "list" | "value" | "test">;
    take: import("..").Operation<"list" | "count", never, never>;
    skip: import("..").Operation<"list" | "count", never, never>;
    drop: import("..").Operation<"list" | "count", never, never>;
    append: import("..").Operation<"list" | "append", never, never>;
    prepend: import("..").Operation<"list" | "prepend", never, never>;
    indexOf: import("..").Operation<"list" | "item" | "isEqual", "start", "list" | "value" | "test">;
    lastIndexOf: import("..").Operation<"list" | "item" | "isEqual", "start", "list" | "value" | "test">;
    last: import("..").Operation<"list", never, never>;
    first: import("..").Operation<"list", never, never>;
    count: import("..").Operation<"list", never, never>;
    randomList: import("..").Operation<"list" | "count", never, never>;
    random: import("..").Operation<"list", never, never>;
    join: import("..").Operation<"list", "toText" | "delimiter" | "prefix" | "suffix", "list" | "item" | "index">;
    each: import("..").Operation<"list" | "each", "reverse", "list" | "item" | "index">;
    filter: import("..").Operation<"list" | "filter", any, "list" | "item" | "index">;
    not: import("..").Operation<"list" | "not", any, "list" | "item" | "index">;
    map: import("..").Operation<"list" | "transform", any, "list" | "item" | "index">;
    split: import("..").Operation<"list" | "pass", any, "list" | "item" | "index">;
    reduce: import("..").Operation<"list" | "reduce" | "initial", any, "list" | "item" | "index" | "reduced">;
    cmp: import("..").Operation<"value" | "test" | "compare", any, "list" | "value" | "test">;
    group: import("..").Operation<"list" | "getKey", "getValue", "list" | "item" | "index">;
    toMap: import("..").Operation<"list" | "getKey", "getValue", "list" | "item" | "index">;
    isValid: import("..").Operation<"value", never, never>;
    isEmpty: import("..").Operation<"list", never, never>;
    isNotEmpty: import("..").Operation<"list", never, never>;
    isEqual: import("..").Operation<"list" | "test" | "isEqual", any, "list" | "value" | "test">;
    isNotEqual: import("..").Operation<"list" | "test" | "isEqual", any, "list" | "value" | "test">;
    isLess: import("..").Operation<"value" | "test" | "compare", any, "list" | "value" | "test">;
    isLessOrEqual: import("..").Operation<"value" | "test" | "compare", any, "list" | "value" | "test">;
    isGreater: import("..").Operation<"value" | "test" | "compare", any, "list" | "value" | "test">;
    isGreaterOrEqual: import("..").Operation<"value" | "test" | "compare", any, "list" | "value" | "test">;
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
