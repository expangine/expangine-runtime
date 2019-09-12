export declare const NumberOps: {
    create: import("..").Operation<never, never, never>;
    pi: import("..").Operation<never, never, never>;
    pi2: import("..").Operation<never, never, never>;
    piHalf: import("..").Operation<never, never, never>;
    e: import("..").Operation<never, never, never>;
    sqrt2: import("..").Operation<never, never, never>;
    sqrt12: import("..").Operation<never, never, never>;
    ln2: import("..").Operation<never, never, never>;
    ln10: import("..").Operation<never, never, never>;
    log2e: import("..").Operation<never, never, never>;
    log10e: import("..").Operation<never, never, never>;
    add: import("..").Operation<"value" | "addend", never, never>;
    sub: import("..").Operation<"value" | "subtrahend", never, never>;
    mul: import("..").Operation<"value" | "multiplier", never, never>;
    div: import("..").Operation<"value" | "divisor", never, never>;
    mod: import("..").Operation<"value" | "divisor", never, never>;
    min: import("..").Operation<"a" | "b", never, never>;
    max: import("..").Operation<"a" | "b", never, never>;
    pow: import("..").Operation<"value" | "exponent", never, never>;
    atan2: import("..").Operation<"x" | "y", never, never>;
    hypot: import("..").Operation<"a" | "b", never, never>;
    choose: import("..").Operation<"k" | "n", never, never>;
    gcd: import("..").Operation<"a" | "b", never, never>;
    bitAnd: import("..").Operation<"a" | "b", never, never>;
    bitOr: import("..").Operation<"a" | "b", never, never>;
    bitXor: import("..").Operation<"a" | "b", never, never>;
    cmp: import("..").Operation<"value" | "test", never, never>;
    sqrt: import("..").Operation<"value", never, never>;
    sq: import("..").Operation<"value", never, never>;
    cbrt: import("..").Operation<"value", never, never>;
    floor: import("..").Operation<"value", never, never>;
    ceil: import("..").Operation<"value", never, never>;
    up: import("..").Operation<"value", never, never>;
    down: import("..").Operation<"value", never, never>;
    round: import("..").Operation<"value", never, never>;
    abs: import("..").Operation<"value", never, never>;
    neg: import("..").Operation<"value", never, never>;
    sign: import("..").Operation<"value", never, never>;
    log: import("..").Operation<"value", never, never>;
    sin: import("..").Operation<"value", never, never>;
    cos: import("..").Operation<"value", never, never>;
    tan: import("..").Operation<"value", never, never>;
    sinh: import("..").Operation<"value", never, never>;
    cosh: import("..").Operation<"value", never, never>;
    asin: import("..").Operation<"value", never, never>;
    acos: import("..").Operation<"value", never, never>;
    atan: import("..").Operation<"value", never, never>;
    factorial: import("..").Operation<"value", never, never>;
    bitFlip: import("..").Operation<"value", never, never>;
    clamp: import("..").Operation<"value" | "min" | "max", never, never>;
    triangleHeight: import("..").Operation<"base" | "side1" | "side2", never, never>;
    lerp: import("..").Operation<"start" | "end" | "delta", never, never>;
    rnd: import("..").Operation<any, "min" | "max" | "whole" | "includeMax", never>;
    toBaseText: import("..").Operation<"value", "base" | "minDigits", never>;
    toText: import("..").Operation<"value", "prefix" | "suffix" | "minPlaces" | "maxPlaces" | "useExponent" | "thousandSeparator", never>;
    isValid: import("..").Operation<"value", never, never>;
    isZero: import("..").Operation<"value", "epsilon", never>;
    isEqual: import("..").Operation<"value" | "test", "epsilon", never>;
    isNotEqual: import("..").Operation<"value" | "test", "epsilon", never>;
    isLess: import("..").Operation<"value" | "test", never, never>;
    isLessOrEqual: import("..").Operation<"value" | "test", never, never>;
    isGreater: import("..").Operation<"value" | "test", never, never>;
    isGreaterOrEqual: import("..").Operation<"value" | "test", never, never>;
    isBetween: import("..").Operation<"value" | "min" | "max", "minInclusive" | "maxInclusive", never>;
    isWhole: import("..").Operation<"value", "epsilon", never>;
    isDecimal: import("..").Operation<"value", "epsilon", never>;
    isPositive: import("..").Operation<"value", never, never>;
    isNegative: import("..").Operation<"value", never, never>;
    isDivisible: import("..").Operation<"value" | "by", "epsilon", never>;
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