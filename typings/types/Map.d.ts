import { Type, TypeProvider, TypeInput, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { ListType } from './List';
import { ObjectType } from './Object';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
export interface MapOptions {
    key: Type;
    value: Type;
}
export declare class MapType extends Type<MapOptions> {
    static id: string;
    static operations: Operations;
    static baseType: MapType;
    static decode(data: any[], types: TypeProvider): MapType;
    static encode(type: MapType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static forItem(valueOrClass: TypeInput, keyOrClass?: TypeInput): MapType;
    getId(): string;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any>>;
    merge(type: MapType, describer: TypeDescribeProvider): void;
    getSubTypes(): {
        key: Type<any>;
        value: Type<any>;
    };
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
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
