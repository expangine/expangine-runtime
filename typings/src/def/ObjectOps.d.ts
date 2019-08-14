import { ObjectType } from '../types/Object';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { TextType } from '../types/Text';
import { AnyType } from '../types/Any';
export declare const ObjectOps: {
    has: import("..").OperationBuilder<ObjectType, typeof BooleanType, {
        object: ObjectType;
        key: typeof TextType;
    }, never, never, never>;
    get: import("..").OperationBuilder<ObjectType, typeof AnyType, {
        object: ObjectType;
        key: typeof TextType;
    }, never, never, never>;
    set: import("..").OperationBuilder<ObjectType, ObjectType, {
        object: ObjectType;
        key: typeof TextType;
        value: typeof AnyType;
    }, never, never, never>;
    cmp: import("..").OperationBuilder<ObjectType, typeof NumberType, {
        value: ObjectType;
        test: ObjectType;
    }, never, never, never>;
    copy: import("..").OperationBuilder<ObjectType, ObjectType, {
        object: ObjectType;
    }, never, never, never>;
    isEqual: import("..").OperationBuilder<ObjectType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isNotEqual: import("..").OperationBuilder<ObjectType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isLess: import("..").OperationBuilder<ObjectType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isLessOrEqual: import("..").OperationBuilder<ObjectType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isGreater: import("..").OperationBuilder<ObjectType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
    isGreaterOrEqual: import("..").OperationBuilder<ObjectType, typeof BooleanType, {
        value: typeof AnyType;
        test: typeof AnyType;
    }, never, never, never>;
};
