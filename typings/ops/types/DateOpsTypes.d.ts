export declare const DateOpsTypes: {
    create: import("../..").OperationTypes<never, never, never>;
    now: import("../..").OperationTypes<never, never, never>;
    today: import("../..").OperationTypes<never, never, never>;
    tomorrow: import("../..").OperationTypes<never, never, never>;
    yesterday: import("../..").OperationTypes<never, never, never>;
    maybe: import("../..").OperationTypes<"value", never, never>;
    parse: import("../..").OperationTypes<"value", "parseAsUTC", never>;
    fromText: import("../..").OperationTypes<"value", "parseAsUTC", never>;
    fromTimestamp: import("../..").OperationTypes<"value", never, never>;
    fromTimestampSeconds: import("../..").OperationTypes<"value", never, never>;
    min: import("../..").OperationTypes<"value" | "test", never, never>;
    max: import("../..").OperationTypes<"value" | "test", never, never>;
    get: import("../..").OperationTypes<"value" | "property", never, never>;
    set: import("../..").OperationTypes<"set" | "value" | "property", never, never>;
    add: import("../..").OperationTypes<"value" | "unit", "amount", never>;
    sub: import("../..").OperationTypes<"value" | "unit", "amount", never>;
    startOf: import("../..").OperationTypes<"value" | "unit", never, never>;
    endOf: import("../..").OperationTypes<"value" | "unit", "inclusive", never>;
    daysInMonth: import("../..").OperationTypes<"value", never, never>;
    daysInYear: import("../..").OperationTypes<"value", never, never>;
    weeksInYear: import("../..").OperationTypes<"value", never, never>;
    copy: import("../..").OperationTypes<"value", never, never>;
    cmp: import("../..").OperationTypes<"value" | "test", "unit", never>;
    diff: import("../..").OperationTypes<"value" | "test", "unit" | "absolute" | "adjust", never>;
    timezoneOffset: import("../..").OperationTypes<"value", never, never>;
    toText: import("../..").OperationTypes<"value" | "format", never, never>;
    toISOText: import("../..").OperationTypes<"value", never, never>;
    isValid: import("../..").OperationTypes<"value", never, never>;
    isEqual: import("../..").OperationTypes<"value" | "test", "unit", never>;
    isBefore: import("../..").OperationTypes<"value" | "test", "unit", never>;
    isBeforeOrEqual: import("../..").OperationTypes<"value" | "test", "unit", never>;
    isAfter: import("../..").OperationTypes<"value" | "test", "unit", never>;
    isAfterOrEqual: import("../..").OperationTypes<"value" | "test", "unit", never>;
    isBetween: import("../..").OperationTypes<"value" | "start" | "end", "unit" | "startInclusive" | "endInclusive", never>;
    isStartOf: import("../..").OperationTypes<"value" | "unit", never, never>;
    isEndOf: import("../..").OperationTypes<"value" | "unit", "inclusive", never>;
    isDST: import("../..").OperationTypes<"value", never, never>;
    isLeapYear: import("../..").OperationTypes<"value", never, never>;
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
