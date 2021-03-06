export declare const ListOpsTypes: {
    create: import("../..").OperationTypes<never, never, never>;
    createLike: import("../..").OperationTypes<"list", never, never>;
    createFor: import("../..").OperationTypes<"item", never, never>;
    maybe: import("../..").OperationTypes<"value", never, never>;
    build: import("../..").OperationTypes<"count" | "item", "sameItem", "list" | "index" | "count" | "last">;
    get: import("../..").OperationTypes<"list" | "index", never, never>;
    set: import("../..").OperationTypes<"list" | "value" | "index", never, never>;
    add: import("../..").OperationTypes<"list" | "item", never, never>;
    addFirst: import("../..").OperationTypes<"list" | "item", never, never>;
    addLast: import("../..").OperationTypes<"list" | "item", never, never>;
    insert: import("../..").OperationTypes<"list" | "index" | "item", never, never>;
    remove: import("../..").OperationTypes<"list" | "isEqual" | "item", never, "list" | "value" | "test">;
    removeFirst: import("../..").OperationTypes<"list", never, never>;
    removeLast: import("../..").OperationTypes<"list", never, never>;
    removeAt: import("../..").OperationTypes<"list" | "index", never, never>;
    removeWhere: import("../..").OperationTypes<"list" | "where", never, "list" | "index" | "item">;
    clear: import("../..").OperationTypes<"list", never, never>;
    contains: import("../..").OperationTypes<"list" | "isEqual" | "item", never, "list" | "value" | "test">;
    find: import("../..").OperationTypes<"list" | "where", "reverse" | "start", "list" | "index" | "item">;
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
    indexOf: import("../..").OperationTypes<"list" | "isEqual" | "item", "start", "list" | "value" | "test">;
    lastIndexOf: import("../..").OperationTypes<"list" | "isEqual" | "item", "start", "list" | "value" | "test">;
    findIndex: import("../..").OperationTypes<"list" | "where", "reverse" | "start", "list" | "index" | "item">;
    last: import("../..").OperationTypes<"list", never, never>;
    first: import("../..").OperationTypes<"list", never, never>;
    count: import("../..").OperationTypes<"list", never, never>;
    randomList: import("../..").OperationTypes<"list" | "count", never, never>;
    random: import("../..").OperationTypes<"list", never, never>;
    flatten: import("../..").OperationTypes<"list", never, never>;
    join: import("../..").OperationTypes<"list", "toText" | "prefix" | "suffix" | "delimiter", "list" | "index" | "item">;
    each: import("../..").OperationTypes<"list" | "each", "reverse", "list" | "index" | "item">;
    filter: import("../..").OperationTypes<"list" | "filter", never, "list" | "index" | "item">;
    not: import("../..").OperationTypes<"list" | "not", never, "list" | "index" | "item">;
    map: import("../..").OperationTypes<"list" | "transform", never, "list" | "index" | "item">;
    split: import("../..").OperationTypes<"list" | "pass", never, "list" | "index" | "item">;
    reduce: import("../..").OperationTypes<"list" | "reduce" | "initial", never, "list" | "index" | "item" | "reduced">;
    cmp: import("../..").OperationTypes<"value" | "test" | "compare", never, "list" | "value" | "test">;
    group: import("../..").OperationTypes<"list" | "by", "getValue", "list" | "index" | "item">;
    toListMap: import("../..").OperationTypes<"list" | "getKey", "getValue", "list" | "index" | "item">;
    toMap: import("../..").OperationTypes<"list" | "getKey", "getValue", "list" | "index" | "item">;
    joinInner: import("../..").OperationTypes<"join" | "b" | "a" | "on", never, "onA" | "onB" | "joinA" | "joinB">;
    joinLeft: import("../..").OperationTypes<"join" | "b" | "a" | "on", never, "onA" | "onB" | "joinA" | "joinB">;
    joinRight: import("../..").OperationTypes<"join" | "b" | "a" | "on", never, "onA" | "onB" | "joinA" | "joinB">;
    joinFull: import("../..").OperationTypes<"join" | "b" | "a" | "on", never, "onA" | "onB" | "joinA" | "joinB">;
    joinCross: import("../..").OperationTypes<"join" | "b" | "a", never, "joinA" | "joinB">;
    min: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    max: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    sum: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    avg: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    std: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    variance: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    median: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    bitand: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    bitor: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    bitxor: import("../..").OperationTypes<"list" | "value", never, "list" | "index" | "item">;
    isValid: import("../..").OperationTypes<"value", never, never>;
    isEmpty: import("../..").OperationTypes<"list", never, never>;
    isNotEmpty: import("../..").OperationTypes<"list", never, never>;
    isEqual: import("../..").OperationTypes<"list" | "test" | "isEqual", never, "list" | "value" | "test">;
    isNotEqual: import("../..").OperationTypes<"list" | "test" | "isEqual", never, "list" | "value" | "test">;
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
