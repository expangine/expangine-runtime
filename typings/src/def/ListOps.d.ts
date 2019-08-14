import { ListType } from '../types/List';
import { BooleanType } from '../types/Boolean';
import { NumberType } from '../types/Number';
import { AnyType } from '../types/Any';
import { TextType } from '../types/Text';
import { GenericType } from '../types/Generic';
import { MapType } from '../types/Map';
export declare const ListOps: {
    create: import("..").OperationBuilder<ListType, ListType, {
        count: typeof NumberType;
        item: GenericType;
    }, {
        sameItem: typeof BooleanType;
    }, {
        list: ListType;
        index: typeof NumberType;
        last: GenericType;
        count: typeof NumberType;
    }, never>;
    get: import("..").OperationBuilder<ListType, import("..").Type<any>, {
        list: ListType;
        index: typeof NumberType;
    }, never, never, never>;
    set: import("..").OperationBuilder<ListType, import("..").Type<any>, {
        list: ListType;
        index: typeof NumberType;
        value: import("..").Type<any>;
    }, never, never, never>;
    add: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        item: import("..").Type<any>;
    }, never, never, never>;
    addFirst: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        item: import("..").Type<any>;
    }, never, never, never>;
    addLast: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        item: import("..").Type<any>;
    }, never, never, never>;
    insert: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        item: import("..").Type<any>;
        index: typeof NumberType;
    }, never, never, never>;
    remove: import("..").OperationBuilder<ListType, typeof NumberType, {
        list: ListType;
        item: import("..").Type<any>;
        isEqual: typeof BooleanType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    removeFirst: import("..").OperationBuilder<ListType, import("..").Type<any>, {
        list: ListType;
    }, never, never, never>;
    removeLast: import("..").OperationBuilder<ListType, import("..").Type<any>, {
        list: ListType;
    }, never, never, never>;
    removeAt: import("..").OperationBuilder<ListType, import("..").Type<any>, {
        list: ListType;
        index: typeof NumberType;
    }, never, never, never>;
    contains: import("..").OperationBuilder<ListType, typeof BooleanType, {
        list: ListType;
        item: import("..").Type<any>;
        isEqual: typeof BooleanType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    copy: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
    }, {
        deepCopy: import("..").Type<any>;
    }, {
        copy: import("..").Type<any>;
    }, never>;
    reverse: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
    }, never, never, never>;
    exclude: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        exclude: ListType;
        isEqual: typeof BooleanType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    overlap: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        overlap: ListType;
        isEqual: typeof BooleanType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    sort: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        compare: typeof NumberType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    shuffle: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
    }, {
        times: typeof NumberType;
    }, never, never>;
    unique: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        isEqual: typeof BooleanType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    duplicates: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        isEqual: typeof BooleanType;
    }, {
        once: typeof BooleanType;
    }, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    take: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        count: typeof NumberType;
    }, never, never, never>;
    skip: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        count: typeof NumberType;
    }, never, never, never>;
    drop: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        count: typeof NumberType;
    }, never, never, never>;
    append: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        append: ListType;
    }, never, never, never>;
    prepend: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        prepend: ListType;
    }, never, never, never>;
    indexOf: import("..").OperationBuilder<ListType, typeof NumberType, {
        list: ListType;
        item: import("..").Type<any>;
        isEqual: typeof BooleanType;
    }, {
        start: typeof NumberType;
    }, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    lastIndexOf: import("..").OperationBuilder<ListType, typeof NumberType, {
        list: ListType;
        item: import("..").Type<any>;
        isEqual: typeof BooleanType;
    }, {
        start: typeof NumberType;
    }, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    last: import("..").OperationBuilder<ListType, import("..").Type<any>, {
        list: ListType;
    }, never, never, never>;
    first: import("..").OperationBuilder<ListType, import("..").Type<any>, {
        list: ListType;
    }, never, never, never>;
    count: import("..").OperationBuilder<ListType, typeof NumberType, {
        list: ListType;
    }, never, never, never>;
    randomList: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        count: typeof NumberType;
    }, never, never, never>;
    random: import("..").OperationBuilder<ListType, import("..").Type<any>, {
        list: ListType;
    }, never, never, never>;
    join: import("..").OperationBuilder<ListType, typeof TextType, {
        list: ListType;
    }, {
        delimiter: typeof TextType;
        toText: typeof TextType;
        prefix: typeof TextType;
        suffix: typeof TextType;
    }, {
        list: ListType;
        item: import("..").Type<any>;
        index: NumberType;
    }, never>;
    each: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        each: typeof AnyType;
    }, {
        reverse: typeof BooleanType;
    }, {
        list: ListType;
        item: import("..").Type<any>;
        index: NumberType;
    }, never>;
    filter: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        filter: typeof BooleanType;
    }, {}, {
        list: ListType;
        item: import("..").Type<any>;
        index: NumberType;
    }, never>;
    not: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        not: typeof BooleanType;
    }, {}, {
        list: ListType;
        item: import("..").Type<any>;
        index: NumberType;
    }, never>;
    map: import("..").OperationBuilder<ListType, ListType, {
        list: ListType;
        transform: GenericType;
    }, {}, {
        list: ListType;
        item: import("..").Type<any>;
        index: NumberType;
    }, never>;
    split: import("..").OperationBuilder<ListType, import("..").ObjectType, {
        list: ListType;
        pass: typeof BooleanType;
    }, {}, {
        list: ListType;
        item: import("..").Type<any>;
        index: NumberType;
    }, never>;
    reduce: import("..").OperationBuilder<ListType, GenericType, {
        list: ListType;
        reduce: GenericType;
        initial: GenericType;
    }, {}, {
        list: ListType;
        item: import("..").Type<any>;
        reduced: GenericType;
        index: typeof NumberType;
    }, never>;
    cmp: import("..").OperationBuilder<ListType, typeof BooleanType, {
        value: ListType;
        test: ListType;
        compare: typeof NumberType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    group: import("..").OperationBuilder<ListType, MapType, {
        list: ListType;
        getKey: GenericType;
    }, {
        getValue: GenericType;
    }, {
        list: ListType;
        item: import("..").Type<any>;
        index: NumberType;
    }, never>;
    toMap: import("..").OperationBuilder<ListType, MapType, {
        list: ListType;
        getKey: GenericType;
    }, {
        getValue: GenericType;
    }, {
        list: ListType;
        item: import("..").Type<any>;
        index: NumberType;
    }, never>;
    isEmpty: import("..").OperationBuilder<ListType, typeof BooleanType, {
        list: ListType;
    }, never, never, never>;
    isNotEmpty: import("..").OperationBuilder<ListType, typeof BooleanType, {
        list: ListType;
    }, never, never, never>;
    isEqual: import("..").OperationBuilder<ListType, typeof BooleanType, {
        list: ListType;
        test: ListType;
        isEqual: typeof BooleanType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isNotEqual: import("..").OperationBuilder<ListType, typeof BooleanType, {
        list: ListType;
        test: ListType;
        isEqual: typeof BooleanType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isLess: import("..").OperationBuilder<ListType, typeof BooleanType, {
        value: ListType;
        test: ListType;
        compare: typeof NumberType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isLessOrEqual: import("..").OperationBuilder<ListType, typeof BooleanType, {
        value: ListType;
        test: ListType;
        compare: typeof NumberType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isGreater: import("..").OperationBuilder<ListType, typeof BooleanType, {
        value: ListType;
        test: ListType;
        compare: typeof NumberType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isGreaterOrEqual: import("..").OperationBuilder<ListType, typeof BooleanType, {
        value: ListType;
        test: ListType;
        compare: typeof NumberType;
    }, {}, {
        list: ListType;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
};
