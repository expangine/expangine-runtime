import { Type, TypeProvider, TypeInput, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { ListType } from './List';
import { ObjectType } from './Object';
export interface MapOptions {
    key: Type;
    value: Type;
}
export declare class MapType extends Type<MapOptions> {
    static id: string;
    static operations: Operations<MapType>;
    static baseType: MapType;
    static decode(data: any[], types: TypeProvider): MapType;
    static encode(type: MapType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static forItem(valueOrClass: TypeInput, keyOrClass?: TypeInput): MapType;
    getId(): string;
    merge(type: MapType, describer: TypeDescribeProvider): void;
    getSubTypes(): {
        key: Type<any>;
        value: Type<any>;
    };
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    isValid(test: any): boolean;
    normalize(test: any): any;
    private iterate;
    encode(): any;
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
