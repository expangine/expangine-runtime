import { Operations } from '../Operation';
import { Computeds } from '../Computed';
export declare const NumberOperations: Operations;
export declare const NumberComputeds: Computeds;
export declare const NumberOps: {
    create: import("../Operation").OperationResolved<never, never, never, never, never>;
    pi: import("../Operation").OperationResolved<never, never, never, never, never>;
    pi2: import("../Operation").OperationResolved<never, never, never, never, never>;
    piHalf: import("../Operation").OperationResolved<never, never, never, never, never>;
    e: import("../Operation").OperationResolved<never, never, never, never, never>;
    sqrt2: import("../Operation").OperationResolved<never, never, never, never, never>;
    sqrt12: import("../Operation").OperationResolved<never, never, never, never, never>;
    ln2: import("../Operation").OperationResolved<never, never, never, never, never>;
    ln10: import("../Operation").OperationResolved<never, never, never, never, never>;
    log2e: import("../Operation").OperationResolved<never, never, never, never, never>;
    log10e: import("../Operation").OperationResolved<never, never, never, never, never>;
    add: import("../Operation").OperationResolved<"value" | "addend", never, never, never, never>;
    sub: import("../Operation").OperationResolved<"value" | "subtrahend", never, never, never, never>;
    mul: import("../Operation").OperationResolved<"value" | "multiplier", never, never, never, never>;
    div: import("../Operation").OperationResolved<"value" | "divisor", never, never, never, never>;
    mod: import("../Operation").OperationResolved<"value" | "divisor", never, never, never, never>;
    min: import("../Operation").OperationResolved<"a" | "b", never, never, never, never>;
    max: import("../Operation").OperationResolved<"a" | "b", never, never, never, never>;
    pow: import("../Operation").OperationResolved<"value" | "exponent", never, never, never, never>;
    atan2: import("../Operation").OperationResolved<"x" | "y", never, never, never, never>;
    hypot: import("../Operation").OperationResolved<"a" | "b", never, never, never, never>;
    choose: import("../Operation").OperationResolved<"k" | "n", never, never, never, never>;
    gcd: import("../Operation").OperationResolved<"a" | "b", never, never, never, never>;
    bitAnd: import("../Operation").OperationResolved<"a" | "b", never, never, never, never>;
    bitOr: import("../Operation").OperationResolved<"a" | "b", never, never, never, never>;
    bitXor: import("../Operation").OperationResolved<"a" | "b", never, never, never, never>;
    cmp: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    maybe: import("../Operation").OperationResolved<"value", never, never, never, never>;
    sqrt: import("../Operation").OperationResolved<"value", never, never, never, never>;
    sq: import("../Operation").OperationResolved<"value", never, never, never, never>;
    cbrt: import("../Operation").OperationResolved<"value", never, never, never, never>;
    floor: import("../Operation").OperationResolved<"value", never, never, never, never>;
    ceil: import("../Operation").OperationResolved<"value", never, never, never, never>;
    up: import("../Operation").OperationResolved<"value", never, never, never, never>;
    down: import("../Operation").OperationResolved<"value", never, never, never, never>;
    round: import("../Operation").OperationResolved<"value", never, never, never, never>;
    abs: import("../Operation").OperationResolved<"value", never, never, never, never>;
    neg: import("../Operation").OperationResolved<"value", never, never, never, never>;
    sign: import("../Operation").OperationResolved<"value", never, never, never, never>;
    log: import("../Operation").OperationResolved<"value", never, never, never, never>;
    sin: import("../Operation").OperationResolved<"value", never, never, never, never>;
    cos: import("../Operation").OperationResolved<"value", never, never, never, never>;
    tan: import("../Operation").OperationResolved<"value", never, never, never, never>;
    sinh: import("../Operation").OperationResolved<"value", never, never, never, never>;
    cosh: import("../Operation").OperationResolved<"value", never, never, never, never>;
    asin: import("../Operation").OperationResolved<"value", never, never, never, never>;
    acos: import("../Operation").OperationResolved<"value", never, never, never, never>;
    atan: import("../Operation").OperationResolved<"value", never, never, never, never>;
    factorial: import("../Operation").OperationResolved<"value", never, never, never, never>;
    bitFlip: import("../Operation").OperationResolved<"value", never, never, never, never>;
    clamp: import("../Operation").OperationResolved<"value" | "min" | "max", never, never, never, never>;
    triangleHeight: import("../Operation").OperationResolved<"base" | "side1" | "side2", never, never, never, never>;
    lerp: import("../Operation").OperationResolved<"start" | "end" | "delta", never, never, never, never>;
    rnd: import("../Operation").OperationResolved<any, "min" | "max" | "whole" | "includeMax", never, never, never>;
    toBaseText: import("../Operation").OperationResolved<"value", "base" | "minDigits", never, never, never>;
    toText: import("../Operation").OperationResolved<"value", "prefix" | "suffix" | "minPlaces" | "maxPlaces" | "useExponent" | "thousandSeparator", never, never, never>;
    toPercent: import("../Operation").OperationResolved<"value", "minPlaces" | "maxPlaces" | "thousandSeparator", never, never, never>;
    fromPercent: import("../Operation").OperationResolved<"value", never, never, never, never>;
    isValid: import("../Operation").OperationResolved<"value", never, never, never, never>;
    isZero: import("../Operation").OperationResolved<"value", "epsilon", never, never, never>;
    isEqual: import("../Operation").OperationResolved<"value" | "test", "epsilon", never, never, never>;
    isNotEqual: import("../Operation").OperationResolved<"value" | "test", "epsilon", never, never, never>;
    isLess: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    isLessOrEqual: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    isGreater: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    isGreaterOrEqual: import("../Operation").OperationResolved<"value" | "test", never, never, never, never>;
    isBetween: import("../Operation").OperationResolved<"value" | "min" | "max", "minInclusive" | "maxInclusive", never, never, never>;
    isWhole: import("../Operation").OperationResolved<"value", "epsilon", never, never, never>;
    isDecimal: import("../Operation").OperationResolved<"value", "epsilon", never, never, never>;
    isPositive: import("../Operation").OperationResolved<"value", never, never, never, never>;
    isNegative: import("../Operation").OperationResolved<"value", never, never, never, never>;
    isDivisible: import("../Operation").OperationResolved<"value" | "by", "epsilon", never, never, never>;
    bitCompare: import("../Operation").OperationResolved<"value" | "test" | "method", never, never, never, never>;
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
