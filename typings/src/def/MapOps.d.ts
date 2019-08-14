import { MapType } from '../types/Map';
import { NumberType } from '../types/Number';
import { BooleanType } from '../types/Boolean';
import { GenericType } from '../types/Generic';
import { AnyType } from '../types/Any';
export declare const MapOps: {
    get: import("..").OperationBuilder<MapType, import("..").Type<any>, {
        map: MapType;
        key: import("..").Type<any>;
    }, never, never, never>;
    set: import("..").OperationBuilder<MapType, import("..").Type<any>, {
        map: MapType;
        key: import("..").Type<any>;
        value: import("..").Type<any>;
    }, never, never, never>;
    has: import("..").OperationBuilder<MapType, typeof BooleanType, {
        map: MapType;
        key: import("..").Type<any>;
    }, never, never, never>;
    delete: import("..").OperationBuilder<MapType, typeof BooleanType, {
        map: MapType;
        key: import("..").Type<any>;
    }, never, never, never>;
    keys: import("..").OperationBuilder<MapType, import("..").ListType, {
        map: MapType;
    }, never, never, never>;
    values: import("..").OperationBuilder<MapType, import("..").ListType, {
        map: MapType;
    }, never, never, never>;
    entries: import("..").OperationBuilder<MapType, import("..").ObjectType, {
        map: MapType;
    }, never, never, never>;
    clear: import("..").OperationBuilder<MapType, MapType, {
        map: MapType;
    }, never, never, never>;
    count: import("..").OperationBuilder<MapType, typeof NumberType, {
        map: MapType;
    }, never, never, never>;
    cmp: import("..").OperationBuilder<MapType, typeof NumberType, {
        value: MapType;
        test: MapType;
        compare: typeof NumberType;
    }, {}, {
        key: import("..").Type<any>;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    copy: import("..").OperationBuilder<MapType, MapType, {
        map: MapType;
    }, {
        deepCopy: import("..").Type<any>;
        deepCopyKey: import("..").Type<any>;
    }, {
        map: MapType;
        key: import("..").Type<any>;
        value: import("..").Type<any>;
    }, never>;
    map: import("..").OperationBuilder<MapType, MapType, {
        map: MapType;
    }, {
        transform: GenericType;
        transformKey: GenericType;
    }, {
        map: MapType;
        key: import("..").Type<any>;
        value: import("..").Type<any>;
    }, never>;
    toPlainObject: import("..").OperationBuilder<MapType, typeof AnyType, {
        map: MapType;
    }, never, never, never>;
    isEqual: import("..").OperationBuilder<MapType, typeof BooleanType, {
        value: MapType;
        test: MapType;
        isEqual: typeof BooleanType;
    }, {}, {
        key: import("..").Type<any>;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isNotEqual: import("..").OperationBuilder<MapType, typeof BooleanType, {
        value: MapType;
        test: MapType;
        isEqual: typeof BooleanType;
    }, {}, {
        key: import("..").Type<any>;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isLess: import("..").OperationBuilder<MapType, typeof BooleanType, {
        value: MapType;
        test: MapType;
        compare: typeof NumberType;
    }, {}, {
        key: import("..").Type<any>;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isLessOrEqual: import("..").OperationBuilder<MapType, typeof BooleanType, {
        value: MapType;
        test: MapType;
        compare: typeof NumberType;
    }, {}, {
        key: import("..").Type<any>;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isGreater: import("..").OperationBuilder<MapType, typeof BooleanType, {
        value: MapType;
        test: MapType;
        compare: typeof NumberType;
    }, {}, {
        key: import("..").Type<any>;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
    isGreaterOrEqual: import("..").OperationBuilder<MapType, typeof BooleanType, {
        value: MapType;
        test: MapType;
        compare: typeof NumberType;
    }, {}, {
        key: import("..").Type<any>;
        value: import("..").Type<any>;
        test: import("..").Type<any>;
    }, never>;
};
