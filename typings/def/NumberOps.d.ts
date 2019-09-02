import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { TextType } from '../types/Text';
export declare const NumberOps: {
    create: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    pi: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    pi2: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    piHalf: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    e: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    sqrt2: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    sqrt12: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    ln2: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    ln10: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    log2e: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    log10e: import("..").OperationBuilder<NumberType, typeof NumberType, never, never, never, never>;
    add: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
        addend: typeof NumberType;
    }, never, never, never>;
    sub: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
        subtrahend: typeof NumberType;
    }, never, never, never>;
    mul: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
        multiplier: typeof NumberType;
    }, never, never, never>;
    div: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
        divisor: typeof NumberType;
    }, never, never, never>;
    mod: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
        divisor: typeof NumberType;
    }, never, never, never>;
    min: import("..").OperationBuilder<NumberType, typeof NumberType, {
        a: typeof NumberType;
        b: typeof NumberType;
    }, never, never, never>;
    max: import("..").OperationBuilder<NumberType, typeof NumberType, {
        a: typeof NumberType;
        b: typeof NumberType;
    }, never, never, never>;
    pow: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
        exponent: typeof NumberType;
    }, never, never, never>;
    atan2: import("..").OperationBuilder<NumberType, typeof NumberType, {
        x: typeof NumberType;
        y: typeof NumberType;
    }, never, never, never>;
    hypot: import("..").OperationBuilder<NumberType, typeof NumberType, {
        a: typeof NumberType;
        b: typeof NumberType;
    }, never, never, never>;
    choose: import("..").OperationBuilder<NumberType, typeof NumberType, {
        n: typeof NumberType;
        k: typeof NumberType;
    }, never, never, never>;
    gcd: import("..").OperationBuilder<NumberType, typeof NumberType, {
        a: typeof NumberType;
        b: typeof NumberType;
    }, never, never, never>;
    bitAnd: import("..").OperationBuilder<NumberType, typeof NumberType, {
        a: typeof NumberType;
        b: typeof NumberType;
    }, never, never, never>;
    bitOr: import("..").OperationBuilder<NumberType, typeof NumberType, {
        a: typeof NumberType;
        b: typeof NumberType;
    }, never, never, never>;
    bitXor: import("..").OperationBuilder<NumberType, typeof NumberType, {
        a: typeof NumberType;
        b: typeof NumberType;
    }, never, never, never>;
    cmp: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
        test: typeof NumberType;
    }, never, never, never>;
    sqrt: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    sq: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    cbrt: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    floor: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    ceil: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    up: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    down: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    round: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    abs: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    neg: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    sign: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    log: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    sin: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    cos: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    tan: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    sinh: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    cosh: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    asin: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    acos: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    atan: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    factorial: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    bitFlip: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
    }, never, never, never>;
    clamp: import("..").OperationBuilder<NumberType, typeof NumberType, {
        value: typeof NumberType;
        min: typeof NumberType;
        max: typeof NumberType;
    }, never, never, never>;
    triangleHeight: import("..").OperationBuilder<NumberType, typeof NumberType, {
        base: typeof NumberType;
        side1: typeof NumberType;
        side2: typeof NumberType;
    }, never, never, never>;
    lerp: import("..").OperationBuilder<NumberType, typeof NumberType, {
        delta: typeof NumberType;
        start: typeof NumberType;
        end: typeof NumberType;
    }, never, never, never>;
    rnd: import("..").OperationBuilder<NumberType, typeof NumberType, {}, {
        min: typeof NumberType;
        max: typeof NumberType;
        whole: typeof BooleanType;
        includeMax: typeof BooleanType;
    }, never, never>;
    toBaseText: import("..").OperationBuilder<NumberType, typeof TextType, {
        value: typeof NumberType;
    }, {
        base: typeof NumberType;
        minDigits: typeof NumberType;
    }, never, never>;
    toText: import("..").OperationBuilder<NumberType, typeof TextType, {
        value: typeof NumberType;
    }, {
        prefix: typeof TextType;
        suffix: typeof TextType;
        minPlaces: typeof NumberType;
        maxPlaces: typeof NumberType;
        useExponent: typeof BooleanType;
        thousandSeparator: typeof TextType;
    }, never, never>;
    isValid: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
    }, never, never, never>;
    isZero: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
    }, {
        epsilon: typeof NumberType;
    }, never, never>;
    isEqual: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
        test: typeof NumberType;
    }, {
        epsilon: typeof NumberType;
    }, never, never>;
    isNotEqual: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
        test: typeof NumberType;
    }, {
        epsilon: typeof NumberType;
    }, never, never>;
    isLess: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
        test: typeof NumberType;
    }, never, never, never>;
    isLessOrEqual: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
        test: typeof NumberType;
    }, never, never, never>;
    isGreater: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
        test: typeof NumberType;
    }, never, never, never>;
    isGreaterOrEqual: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
        test: typeof NumberType;
    }, never, never, never>;
    isBetween: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
        min: typeof NumberType;
        max: typeof NumberType;
    }, {
        minInclusive: typeof BooleanType;
        maxInclusive: typeof BooleanType;
    }, never, never>;
    isWhole: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
    }, {
        epsilon: typeof NumberType;
    }, never, never>;
    isDecimal: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
    }, {
        epsilon: typeof NumberType;
    }, never, never>;
    isPositive: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
    }, never, never, never>;
    isNegative: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
    }, never, never, never>;
    isDivisible: import("..").OperationBuilder<NumberType, typeof BooleanType, {
        value: typeof NumberType;
        by: typeof NumberType;
    }, {
        epsilon: typeof NumberType;
    }, never, never>;
};
