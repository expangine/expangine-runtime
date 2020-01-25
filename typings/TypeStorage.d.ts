import { Expression } from './Expression';
import { Definitions } from './Definitions';
import { Runtime } from './Runtime';
import { Type, TypeMap, TypeProps } from './Type';
import { ObjectType } from './types/Object';
import { EnumType } from './types/Enum';
export interface TypeIndex {
    name: string;
    props: string[];
    types?: Type[];
    unique?: boolean;
    primary?: boolean;
}
export interface TypeIndexOptions {
    props: string[];
    unique?: boolean;
    primary?: boolean;
}
export interface TypeStorageOptions {
    name: string;
    key?: any;
    transcoders?: Record<string, TypeStorageTranscoderOptions>;
    indexes?: Record<string, TypeIndexOptions>;
}
export interface TypeStorageTranscoder {
    encode: Expression;
    decode: Expression;
    encodedType: Type;
}
export interface TypeStorageTranscoderOptions {
    encode: any;
    decode: any;
    encodedType: any;
}
export declare enum TypeStoragePrimaryType {
    GIVEN = 0,
    AUTO_INCREMENT = 1,
    UUID = 2
}
export declare class TypeStorage {
    static PRIMARY_TYPES: Record<TypeStoragePrimaryType, Type>;
    name: string;
    type: ObjectType;
    key: Expression;
    transcoders: Record<string, TypeStorageTranscoder>;
    indexes: Record<string, TypeIndex>;
    primaryType: TypeStoragePrimaryType;
    constructor(options: TypeStorageOptions | TypeStorage, defs: Definitions);
    private decodeTranscoders;
    private decodeIndexes;
    encode(): TypeStorageOptions;
    renameProp(prop: string, newProp: string): void;
    removeProp(prop: string): void;
    getTypeProps(): TypeProps;
    getKey(run: Runtime, instance: any): any;
    getDecodedPropertyTypes(): TypeMap;
    getPropertyTypeFor(forProperty?: string): EnumType;
    getEncodedPropertyTypes(): TypeMap;
    getEncodedType(): ObjectType;
    getDecodedType(): ObjectType;
    getProperties(): string[];
    getPropertyType(): EnumType;
    getKeyContext(): Type;
    getEncoded(run: Runtime, instance: any): any;
    getEncodedValue(run: Runtime, instance: any, property: string): any;
    getEncodeContext(forProperty?: string): ObjectType;
    getEncodeExpected(forProperty?: string): Type<any>;
    getDecoded(run: Runtime, encoded: any): any;
    getDecodedValue(run: Runtime, instance: any, property: string): any;
    getDecodeContext(forProperty?: string): ObjectType;
    getDecodeExpected(forProperty?: string): Type<any>;
    getIndexExpectedType(): import(".").SetType;
    getDynamicPrimaryKey(): string;
    getPrimary(name?: string, returnDynamic?: boolean): TypeIndex | null;
    getUniqueIndexes(): TypeIndex[];
    addPrimary(props: string | string[]): this;
    addIndex(name: string, props: string[], unique?: boolean, primary?: boolean): this;
}
