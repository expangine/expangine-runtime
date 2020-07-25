export declare const ListOpsTypes: {
    create: import("../..").OperationTypes<never, never, never>;
    createLike: import("../..").OperationTypes<"list", never, never>;
    createFor: import("../..").OperationTypes<"item", never, never>;
    maybe: import("../..").OperationTypes<"value", never, never>;
    build: import("../..").OperationTypes<"item" | "count", "sameItem", "list" | "count" | "index" | "last">;
    get: import("../..").OperationTypes<"list" | "index", never, never>;
    set: import("../..").OperationTypes<"list" | "value" | "index", never, never>;
    add: import("../..").OperationTypes<"list" | "item", never, never>;
    addFirst: import("../..").OperationTypes<"list" | "item", never, never>;
    addLast: import("../..").OperationTypes<"list" | "item", never, never>;
    insert: import("../..").OperationTypes<"list" | "item" | "index", never, never>;
    remove: import("../..").OperationTypes<"list" | "item" | "isEqual", never, "list" | "value" | "test">;
    removeFirst: import("../..").OperationTypes<"list", never, never>;
    removeLast: import("../..").OperationTypes<"list", never, never>;
    removeAt: import("../..").OperationTypes<"list" | "index", never, never>;
    removeWhere: import("../..").OperationTypes<"list" | "where", never, "list" | "item" | "index">;
    clear: import("../..").OperationTypes<"list", never, never>;
    contains: import("../..").OperationTypes<"list" | "item" | "isEqual", never, "list" | "value" | "test">;
    find: import("../..").OperationTypes<"list" | "where", "start" | "reverse", "list" | "item" | "index">;
    copy: import("../..").OperationTypes<"list", "deepCopy", "copy">;
    reverse: import("../..").OperationTypes<"list", never, never>;
    exclude: import("../..").OperationTypes<"list" | "isEqual" | "exclude", never, "list" | "value" | "test">;
    overlap: import("../..").OperationTypes<"list" | "isEqual" | "overlap", never, "list" | "value" | "test">;
    sort: import("../..").OperationTypes<"list" | "compare", never, "list" | "value" | "test">;
    shuffle: import("../..").OperationTypes<"list", "times", never>;
    unique: import("../..").OperationTypes<"list" | "isEqual", never, "list" | "value" | "test">;
    duplicates: import("../..").OperationTypes<"list" | "isEqual", "once", "list" | "value" | "test">;
    take: import("../..").OperationTypes<"list" | "count", never, never>;
    skip: import("../..").OperationTypes<"list" | "count", never, never>;
    drop: import("../..").OperationTypes<"list" | "count", never, never>;
    append: import("../..").OperationTypes<"list" | "append", never, never>;
    prepend: import("../..").OperationTypes<"list" | "prepend", never, never>;
    indexOf: import("../..").OperationTypes<"list" | "item" | "isEqual", "start", "list" | "value" | "test">;
    lastIndexOf: import("../..").OperationTypes<"list" | "item" | "isEqual", "start", "list" | "value" | "test">;
    findIndex: import("../..").OperationTypes<"list" | "where", "start" | "reverse", "list" | "item" | "index">;
    last: import("../..").OperationTypes<"list", never, never>;
    first: import("../..").OperationTypes<"list", never, never>;
    count: import("../..").OperationTypes<"list", never, never>;
    randomList: import("../..").OperationTypes<"list" | "count", never, never>;
    random: import("../..").OperationTypes<"list", never, never>;
    join: import("../..").OperationTypes<"list", "delimiter" | "toText" | "prefix" | "suffix", "list" | "item" | "index">;
    each: import("../..").OperationTypes<"list" | "each", "reverse", "list" | "item" | "index">;
    filter: import("../..").OperationTypes<"list" | "filter", never, "list" | "item" | "index">;
    not: import("../..").OperationTypes<"list" | "not", never, "list" | "item" | "index">;
    map: import("../..").OperationTypes<"list" | "transform", never, "list" | "item" | "index">;
    split: import("../..").OperationTypes<"list" | "pass", never, "list" | "item" | "index">;
    reduce: import("../..").OperationTypes<"list" | "reduce" | "initial", never, "list" | "item" | "index" | "reduced">;
    cmp: import("../..").OperationTypes<"value" | "test" | "compare", never, "list" | "value" | "test">;
    group: import("../..").OperationTypes<"list" | "by", "getValue", "list" | "item" | "index">;
    toListMap: import("../..").OperationTypes<"list" | "getKey", "getValue", "list" | "item" | "index">;
    toMap: import("../..").OperationTypes<"list" | "getKey", "getValue", "list" | "item" | "index">;
    joinInner: import("../..").OperationTypes<"join" | "a" | "b" | "on", never, "onA" | "onB" | "joinA" | "joinB">;
    joinLeft: import("../..").OperationTypes<"join" | "a" | "b" | "on", never, "onA" | "onB" | "joinA" | "joinB">;
    joinRight: import("../..").OperationTypes<"join" | "a" | "b" | "on", never, "onA" | "onB" | "joinA" | "joinB">;
    joinFull: import("../..").OperationTypes<"join" | "a" | "b" | "on", never, "onA" | "onB" | "joinA" | "joinB">;
    joinCross: import("../..").OperationTypes<"join" | "a" | "b", never, "joinA" | "joinB">;
    min: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    max: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    sum: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    avg: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    std: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    variance: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    median: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    bitand: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    bitor: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    bitxor: import("../..").OperationTypes<"list" | "value", never, "list" | "item" | "index">;
    isValid: import("../..").OperationTypes<"value", never, never>;
    isEmpty: import("../..").OperationTypes<"list", never, never>;
    isNotEmpty: import("../..").OperationTypes<"list", never, never>;
    isEqual: import("../..").OperationTypes<"list" | "isEqual" | "test", never, "list" | "value" | "test">;
    isNotEqual: import("../..").OperationTypes<"list" | "isEqual" | "test", never, "list" | "value" | "test">;
    isLess: import("../..").OperationTypes<"value" | "test" | "compare", never, "list" | "value" | "test">;
    isLessOrEqual: import("../..").OperationTypes<"value" | "test" | "compare", never, "list" | "value" | "test">;
    isGreater: import("../..").OperationTypes<"value" | "test" | "compare", never, "list" | "value" | "test">;
    isGreaterOrEqual: import("../..").OperationTypes<"value" | "test" | "compare", never, "list" | "value" | "test">;
    asAny: import("../..").OperationTypes<"value", never, never>;
    asBoolean: import("../..").OperationTypes<"value", never, never>;
    asColor: import("../..").OperationTypes<"value", never, never>;
    asDate: import("../..").OperationTypes<"value", never, never>;
    asList: import("../..").OperationTypes<"value", never, never>;
    asMap: import("../..").OperationTypes<"value", never, never>;
    asNumber: import("../..").OperationTypes<"value", never, never>;
    asObject: import("../..").OperationTypes<"value", never, never>;
    asText: import("../..").OperationTypes<"value", never, never>;
    asTuple: import("../..").OperationTypes<"value", never, never>;
    asSet: import("../..").OperationTypes<"value", never, never>;
};
