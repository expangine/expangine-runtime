import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { TextType } from '../types/Text';
import { ListType } from '../types/List';
export declare const TextOps: {
    append: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
        append: typeof TextType;
    }, never, never, never>;
    prepend: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
        prepend: typeof TextType;
    }, never, never, never>;
    lower: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
    }, never, never, never>;
    upper: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
    }, never, never, never>;
    char: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
        index: typeof NumberType;
    }, {
        outside: typeof TextType;
    }, never, never>;
    replace: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
        find: typeof TextType;
        replace: typeof TextType;
    }, never, never, never>;
    repeat: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
        times: typeof NumberType;
    }, never, never, never>;
    split: import("..").OperationBuilder<TextType, ListType, {
        value: typeof TextType;
        by: typeof TextType;
    }, {
        limit: typeof NumberType;
    }, never, never>;
    chars: import("..").OperationBuilder<TextType, ListType, {
        value: typeof TextType;
    }, never, never, never>;
    sub: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
        start: typeof NumberType;
    }, {
        end: typeof NumberType;
    }, never, never>;
    indexOf: import("..").OperationBuilder<TextType, typeof NumberType, {
        value: typeof TextType;
        search: typeof TextType;
    }, {
        start: typeof NumberType;
    }, never, never>;
    lastIndexOf: import("..").OperationBuilder<TextType, typeof NumberType, {
        value: typeof TextType;
        search: typeof TextType;
    }, {
        start: typeof NumberType;
    }, never, never>;
    trim: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
    }, {
        start: typeof BooleanType;
        end: typeof BooleanType;
    }, never, never>;
    startsWith: import("..").OperationBuilder<TextType, typeof BooleanType, {
        value: typeof TextType;
        test: typeof TextType;
    }, never, never, never>;
    endsWith: import("..").OperationBuilder<TextType, typeof BooleanType, {
        value: typeof TextType;
        test: typeof TextType;
    }, never, never, never>;
    soundex: import("..").OperationBuilder<TextType, typeof TextType, {
        value: typeof TextType;
    }, {
        max: typeof NumberType;
        min: typeof NumberType;
    }, never, never>;
    distance: import("..").OperationBuilder<TextType, typeof NumberType, {
        value: typeof TextType;
        test: typeof TextType;
    }, never, never, never>;
    length: import("..").OperationBuilder<TextType, typeof NumberType, {
        value: typeof TextType;
    }, never, never, never>;
    compare: import("..").OperationBuilder<TextType, typeof NumberType, {
        value: typeof TextType;
        test: typeof TextType;
    }, {
        ignoreCase: typeof BooleanType;
    }, never, never>;
    toNumber: import("..").OperationBuilder<TextType, typeof NumberType, {
        value: typeof TextType;
    }, {
        invalidValue: typeof NumberType;
    }, never, never>;
    isValid: import("..").OperationBuilder<TextType, typeof BooleanType, {
        a: typeof TextType;
    }, never, never, never>;
    isEmpty: import("..").OperationBuilder<TextType, typeof BooleanType, {
        a: typeof TextType;
    }, never, never, never>;
    isNotEmpty: import("..").OperationBuilder<TextType, typeof BooleanType, {
        a: typeof TextType;
    }, never, never, never>;
    isEqual: import("..").OperationBuilder<TextType, typeof BooleanType, {
        a: typeof TextType;
        b: typeof TextType;
    }, {
        ignoreCase: typeof BooleanType;
    }, never, never>;
    isNotEqual: import("..").OperationBuilder<TextType, typeof BooleanType, {
        a: typeof TextType;
        b: typeof TextType;
    }, {
        ignoreCase: typeof BooleanType;
    }, never, never>;
    isLess: import("..").OperationBuilder<TextType, typeof BooleanType, {
        value: typeof TextType;
        test: typeof TextType;
    }, {
        ignoreCase: typeof BooleanType;
    }, never, never>;
    isLessOrEqual: import("..").OperationBuilder<TextType, typeof BooleanType, {
        value: typeof TextType;
        test: typeof TextType;
    }, {
        ignoreCase: typeof BooleanType;
    }, never, never>;
    isGreater: import("..").OperationBuilder<TextType, typeof BooleanType, {
        value: typeof TextType;
        test: typeof TextType;
    }, {
        ignoreCase: typeof BooleanType;
    }, never, never>;
    isGreaterOrEqual: import("..").OperationBuilder<TextType, typeof BooleanType, {
        value: typeof TextType;
        test: typeof TextType;
    }, {
        ignoreCase: typeof BooleanType;
    }, never, never>;
    isLower: import("..").OperationBuilder<TextType, typeof BooleanType, {
        value: typeof TextType;
    }, never, never, never>;
    isUpper: import("..").OperationBuilder<TextType, typeof BooleanType, {
        value: typeof TextType;
    }, never, never, never>;
};
