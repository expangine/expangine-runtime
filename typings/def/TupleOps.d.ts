import { TupleType } from '../types/Tuple';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { AnyType } from '../types/Any';
export declare const TupleOps: {
    cmp: import("..").OperationBuilder<TupleType, typeof NumberType, {
        value: typeof TupleType;
        test: typeof TupleType;
    }, never, never, never>;
    copy: import("..").OperationBuilder<TupleType, typeof TupleType, {
        value: typeof TupleType;
    }, never, never, never>;
    get: import("..").OperationBuilder<TupleType, typeof AnyType, {
        value: typeof TupleType;
        index: typeof NumberType;
    }, never, never, never>;
    set: import("..").OperationBuilder<TupleType, typeof AnyType, {
        value: typeof TupleType;
        index: typeof NumberType;
        element: typeof AnyType;
    }, never, never, never>;
    isEqual: import("..").OperationBuilder<TupleType, typeof BooleanType, {
        value: typeof TupleType;
        test: typeof TupleType;
    }, never, never, never>;
    isNotEqual: import("..").OperationBuilder<TupleType, typeof BooleanType, {
        value: typeof TupleType;
        test: typeof TupleType;
    }, never, never, never>;
    isLess: import("..").OperationBuilder<TupleType, typeof BooleanType, {
        value: typeof TupleType;
        test: typeof TupleType;
    }, never, never, never>;
    isLessOrEqual: import("..").OperationBuilder<TupleType, typeof BooleanType, {
        value: typeof TupleType;
        test: typeof TupleType;
    }, never, never, never>;
    isGreater: import("..").OperationBuilder<TupleType, typeof BooleanType, {
        value: typeof TupleType;
        test: typeof TupleType;
    }, never, never, never>;
    isGreaterOrEqual: import("..").OperationBuilder<TupleType, typeof BooleanType, {
        value: typeof TupleType;
        test: typeof TupleType;
    }, never, never, never>;
};
