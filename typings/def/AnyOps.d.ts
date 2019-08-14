import { AnyType } from '../types/Any';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
export declare const AnyOps: {
    cmp: import("..").OperationBuilder<AnyType, typeof NumberType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    copy: import("..").OperationBuilder<AnyType, typeof AnyType, {
        value: typeof AnyType;
    }, never, never, never>;
    isEqual: import("..").OperationBuilder<AnyType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isNotEqual: import("..").OperationBuilder<AnyType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isLess: import("..").OperationBuilder<AnyType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isLessOrEqual: import("..").OperationBuilder<AnyType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isGreater: import("..").OperationBuilder<AnyType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isGreaterOrEqual: import("..").OperationBuilder<AnyType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
};
