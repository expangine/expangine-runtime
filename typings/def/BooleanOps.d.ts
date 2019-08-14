import { BooleanType } from '../types/Boolean';
import { NumberType } from '../types/Number';
export declare const BooleanOps: {
    and: import("..").OperationBuilder<BooleanType, typeof BooleanType, {
        a: typeof BooleanType;
        b: typeof BooleanType;
    }, never, never, never>;
    or: import("..").OperationBuilder<BooleanType, typeof BooleanType, {
        a: typeof BooleanType;
        b: typeof BooleanType;
    }, never, never, never>;
    xor: import("..").OperationBuilder<BooleanType, typeof BooleanType, {
        a: typeof BooleanType;
        b: typeof BooleanType;
    }, never, never, never>;
    not: import("..").OperationBuilder<BooleanType, typeof BooleanType, {
        a: typeof BooleanType;
    }, never, never, never>;
    cmp: import("..").OperationBuilder<BooleanType, typeof NumberType, {
        value: typeof BooleanType;
        test: typeof BooleanType;
    }, never, never, never>;
    isValid: import("..").OperationBuilder<BooleanType, typeof BooleanType, {
        value: typeof BooleanType;
    }, never, never, never>;
    isTrue: import("..").OperationBuilder<BooleanType, typeof BooleanType, {
        value: typeof BooleanType;
    }, never, never, never>;
    isFalse: import("..").OperationBuilder<BooleanType, typeof BooleanType, {
        value: typeof BooleanType;
    }, never, never, never>;
};
