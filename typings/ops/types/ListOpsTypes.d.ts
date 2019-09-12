export declare const ListOpsTypes: {
    create: import("../..").OperationTypes<never, never, never>;
    build: import("../..").OperationTypes<"item" | "count", "sameItem", "list" | "index" | "count" | "last">;
    get: import("../..").OperationTypes<"list" | "index", never, never>;
    set: import("../..").OperationTypes<"value" | "list" | "index", never, never>;
    add: import("../..").OperationTypes<"list" | "item", never, never>;
    addFirst: import("../..").OperationTypes<"list" | "item", never, never>;
    addLast: import("../..").OperationTypes<"list" | "item", never, never>;
    insert: import("../..").OperationTypes<"list" | "item" | "index", never, never>;
    remove: import("../..").OperationTypes<"list" | "item" | "isEqual", any, "value" | "list" | "test">;
    removeFirst: import("../..").OperationTypes<"list", never, never>;
    removeLast: import("../..").OperationTypes<"list", never, never>;
    removeAt: import("../..").OperationTypes<"list" | "index", never, never>;
    contains: import("../..").OperationTypes<"list" | "item" | "isEqual", any, "value" | "list" | "test">;
    copy: import("../..").OperationTypes<"list", "deepCopy", "copy">;
    reverse: import("../..").OperationTypes<"list", never, never>;
    exclude: import("../..").OperationTypes<"list" | "isEqual" | "exclude", any, "value" | "list" | "test">;
    overlap: import("../..").OperationTypes<"list" | "isEqual" | "overlap", any, "value" | "list" | "test">;
    sort: import("../..").OperationTypes<"list" | "compare", any, "value" | "list" | "test">;
    shuffle: import("../..").OperationTypes<"list", "times", never>;
    unique: import("../..").OperationTypes<"list" | "isEqual", any, "value" | "list" | "test">;
    duplicates: import("../..").OperationTypes<"list" | "isEqual", "once", "value" | "list" | "test">;
    take: import("../..").OperationTypes<"list" | "count", never, never>;
    skip: import("../..").OperationTypes<"list" | "count", never, never>;
    drop: import("../..").OperationTypes<"list" | "count", never, never>;
    append: import("../..").OperationTypes<"list" | "append", never, never>;
    prepend: import("../..").OperationTypes<"list" | "prepend", never, never>;
    indexOf: import("../..").OperationTypes<"list" | "item" | "isEqual", "start", "value" | "list" | "test">;
    lastIndexOf: import("../..").OperationTypes<"list" | "item" | "isEqual", "start", "value" | "list" | "test">;
    last: import("../..").OperationTypes<"list", never, never>;
    first: import("../..").OperationTypes<"list", never, never>;
    count: import("../..").OperationTypes<"list", never, never>;
    randomList: import("../..").OperationTypes<"list" | "count", never, never>;
    random: import("../..").OperationTypes<"list", never, never>;
    join: import("../..").OperationTypes<"list", "toText" | "delimiter" | "prefix" | "suffix", "list" | "item" | "index">;
    each: import("../..").OperationTypes<"list" | "each", "reverse", "list" | "item" | "index">;
    filter: import("../..").OperationTypes<"list" | "filter", any, "list" | "item" | "index">;
    not: import("../..").OperationTypes<"list" | "not", any, "list" | "item" | "index">;
    map: import("../..").OperationTypes<"list" | "transform", any, "list" | "item" | "index">;
    split: import("../..").OperationTypes<"list" | "pass", any, "list" | "item" | "index">;
    reduce: import("../..").OperationTypes<"list" | "reduce" | "initial", any, "list" | "item" | "index" | "reduced">;
    cmp: import("../..").OperationTypes<"value" | "test" | "compare", any, "value" | "list" | "test">;
    group: import("../..").OperationTypes<"list" | "getKey", "getValue", "list" | "item" | "index">;
    toMap: import("../..").OperationTypes<"list" | "getKey", "getValue", "list" | "item" | "index">;
    isEmpty: import("../..").OperationTypes<"list", never, never>;
    isNotEmpty: import("../..").OperationTypes<"list", never, never>;
    isEqual: import("../..").OperationTypes<"list" | "test" | "isEqual", any, "value" | "list" | "test">;
    isNotEqual: import("../..").OperationTypes<"list" | "test" | "isEqual", any, "value" | "list" | "test">;
    isLess: import("../..").OperationTypes<"value" | "test" | "compare", any, "value" | "list" | "test">;
    isLessOrEqual: import("../..").OperationTypes<"value" | "test" | "compare", any, "value" | "list" | "test">;
    isGreater: import("../..").OperationTypes<"value" | "test" | "compare", any, "value" | "list" | "test">;
    isGreaterOrEqual: import("../..").OperationTypes<"value" | "test" | "compare", any, "value" | "list" | "test">;
    asAny: import("../..").OperationTypes<"value", never, never>;
    asBoolean: import("../..").OperationTypes<"value", never, never>;
    asDate: import("../..").OperationTypes<"value", never, never>;
    asList: import("../..").OperationTypes<"value", never, never>;
    asMap: import("../..").OperationTypes<"value", never, never>;
    asNumber: import("../..").OperationTypes<"value", never, never>;
    asObject: import("../..").OperationTypes<"value", never, never>;
    asText: import("../..").OperationTypes<"value", never, never>;
    asTuple: import("../..").OperationTypes<"value", never, never>;
};
