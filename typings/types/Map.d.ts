import { Type, TypeProvider, TypeInput, TypeDescribeProvider, TypeMap } from '../Type';
import { ListType } from './List';
import { ObjectType } from './Object';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { Traverser } from '../Traverser';
export interface MapOptions {
    key: Type;
    value: Type;
}
export declare class MapType extends Type<MapOptions> {
    static id: string;
    static operations: import("..").Operations;
    static baseType: MapType;
    static decode(data: any[], types: TypeProvider): MapType;
    static encode(type: MapType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static forItem(valueOrClass: TypeInput, keyOrClass?: TypeInput): MapType;
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: MapType, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(): [TypeMap, Type[]];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    isCompatible(other: Type): boolean;
    traverse<R>(traverse: Traverser<Type, R>): R;
    getCreateExpression(ex: ExpressionBuilder): Expression;
    getValidateExpression(ex: ExpressionBuilder): Expression;
    getCompareExpression(ex: ExpressionBuilder): Expression;
    isValid(test: any): boolean;
    normalize(test: any): any;
    private iterate;
    newInstance(): MapType;
    clone(): MapType;
    encode(): any;
    create(): Map<any, any>;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: Array<[any, any]>): Map<any, any>;
    toJson(map: Map<any, any>): Array<[any, any]>;
    getValuesType(): ListType;
    getKeysType(): ListType;
    getEntriesType(): ObjectType;
    getIterationScope(): {
        map: MapType;
        key: Type<any>;
        value: Type<any>;
    };
    static readonly IterationScopeDefaults: {
        map: string;
        key: string;
        value: string;
    };
    getCompareScope(): {
        key: Type<any>;
        value: Type<any>;
        test: Type<any>;
    };
    static readonly CompareScopeDefaults: {
        key: string;
        value: string;
        test: string;
    };
}
