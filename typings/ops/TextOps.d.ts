import { Operations } from '../Operation';
import { Computeds } from '../Computed';
export declare const TextOperations: Operations;
export declare const TextComputeds: Computeds;
export declare const TextOps: {
    create: import("../Operation").Operation<never, never, never, never, never>;
    uuid: import("../Operation").Operation<never, never, never, never, never>;
    maybe: import("../Operation").Operation<"value", never, never, never, never>;
    append: import("../Operation").Operation<"value" | "append", never, never, never, never>;
    prepend: import("../Operation").Operation<"value" | "prepend", never, never, never, never>;
    lower: import("../Operation").Operation<"value", never, never, never, never>;
    upper: import("../Operation").Operation<"value", never, never, never, never>;
    char: import("../Operation").Operation<"value" | "index", "outside", never, never, never>;
    replace: import("../Operation").Operation<"replace" | "value" | "find", never, never, never, never>;
    repeat: import("../Operation").Operation<"value" | "times", never, never, never, never>;
    split: import("../Operation").Operation<"value" | "by", "limit", never, never, never>;
    chars: import("../Operation").Operation<"value", never, never, never, never>;
    sub: import("../Operation").Operation<"value", "start" | "end", never, never, never>;
    indexOf: import("../Operation").Operation<"search" | "value", "start", never, never, never>;
    lastIndexOf: import("../Operation").Operation<"search" | "value", "start", never, never, never>;
    trim: import("../Operation").Operation<"value", "start" | "end", never, never, never>;
    startsWith: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    endsWith: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    soundex: import("../Operation").Operation<"value", "min" | "max", never, never, never>;
    metaphone: import("../Operation").Operation<"value", never, never, never, never>;
    distance: import("../Operation").Operation<"value" | "test", never, never, never, never>;
    length: import("../Operation").Operation<"value", never, never, never, never>;
    compare: import("../Operation").Operation<"value" | "test", "ignoreCase", never, never, never>;
    like: import("../Operation").Operation<"value" | "pattern", "ignoreCase", never, never, never>;
    pad: import("../Operation").Operation<"value" | "min" | "padding", "max" | "append", never, never, never>;
    regexTest: import("../Operation").Operation<"value" | "regex", "ignoreCase" | "multiline", never, never, never>;
    regexSplit: import("../Operation").Operation<"value" | "regex", "limit" | "ignoreCase" | "multiline", never, never, never>;
    regexMatch: import("../Operation").Operation<"value" | "regex", "ignoreCase" | "multiline", never, never, never>;
    regexMatchAll: import("../Operation").Operation<"value" | "regex", "ignoreCase" | "multiline", never, never, never>;
    regexReplace: import("../Operation").Operation<"value" | "regex" | "replacement", "ignoreCase" | "multiline" | "all", never, never, never>;
    regexReplaceDynamic: import("../Operation").Operation<"replace" | "value" | "regex", "ignoreCase" | "multiline" | "all", "match", "replace", never>;
    regexIndexOf: import("../Operation").Operation<"value" | "regex", "ignoreCase" | "multiline", never, never, never>;
    base64: import("../Operation").Operation<"value", never, never, never, never>;
    unbase64: import("../Operation").Operation<"value", never, never, never, never>;
    encodeURI: import("../Operation").Operation<"value", never, never, never, never>;
    decodeURI: import("../Operation").Operation<"value", never, never, never, never>;
    encodeURIComponent: import("../Operation").Operation<"value", never, never, never, never>;
    decodeURIComponent: import("../Operation").Operation<"value", never, never, never, never>;
    md5: import("../Operation").Operation<"value", never, never, never, never>;
    encrypt: import("../Operation").Operation<"value" | "secret", never, never, never, never>;
    decrypt: import("../Operation").Operation<"value" | "secret", never, never, never, never>;
    toNumber: import("../Operation").Operation<"value", "invalidValue", never, never, never>;
    isValid: import("../Operation").Operation<"value", never, never, never, never>;
    isEmpty: import("../Operation").Operation<"value", never, never, never, never>;
    isNotEmpty: import("../Operation").Operation<"value", never, never, never, never>;
    isEqual: import("../Operation").Operation<"a" | "b", "ignoreCase", never, never, never>;
    isNotEqual: import("../Operation").Operation<"a" | "b", "ignoreCase", never, never, never>;
    isLess: import("../Operation").Operation<"value" | "test", "ignoreCase", never, never, never>;
    isLessOrEqual: import("../Operation").Operation<"value" | "test", "ignoreCase", never, never, never>;
    isGreater: import("../Operation").Operation<"value" | "test", "ignoreCase", never, never, never>;
    isGreaterOrEqual: import("../Operation").Operation<"value" | "test", "ignoreCase", never, never, never>;
    isLower: import("../Operation").Operation<"value", never, never, never, never>;
    isUpper: import("../Operation").Operation<"value", never, never, never, never>;
    isUuid: import("../Operation").Operation<"value", never, never, never, never>;
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
};
