import { Type, TypeProvider, TypeInput } from '../Type';
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
    static forItem(valueOrClass: TypeInput, keyOrClass?: TypeInput): MapType;
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
