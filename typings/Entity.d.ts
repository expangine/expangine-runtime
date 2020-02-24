import { ObjectType } from './types/Object';
import { Definitions } from './Definitions';
import { FuncOptions, Func } from './Func';
import { Type, TypeMap } from './Type';
import { Expression } from './Expression';
import { Runtime } from './Runtime';
import { EnumType } from './types/Enum';
import { Relation } from './Relation';
export interface EntityOptions {
    name: string;
    description: string;
    meta: any;
    type: any;
    instances: any[];
    key?: any;
    describe?: any;
    transcoders?: Record<string, EntityStorageTranscoderOptions>;
    indexes?: Record<string, EntityIndexOptions>;
    methods?: Record<string, Func | FuncOptions>;
}
export interface EntityIndex {
    name: string;
    props: string[];
    types?: Type[];
    unique?: boolean;
    primary?: boolean;
}
export interface EntityIndexOptions {
    props: string[];
    unique?: boolean;
    primary?: boolean;
}
export interface EntityStorageTranscoder {
    encode: Expression;
    decode: Expression;
    encodedType: Type;
}
export interface EntityStorageTranscoderOptions {
    encode: any;
    decode: any;
    encodedType: any;
}
export declare type EntityPropPair = [string, Type];
export interface EntityProps {
    type: EntityKeyType;
    props: EntityPropPair[];
    relation?: Relation;
}
export declare enum EntityKeyType {
    PRIMARY = 0,
    FOREIGN = 1,
    NONE = 2
}
export declare enum EntityStoragePrimaryType {
    GIVEN = 0,
    AUTO_INCREMENT = 1,
    UUID = 2
}
export declare class Entity {
    static create(defs: Definitions, defaults?: Partial<EntityOptions>): Entity;
    static PRIMARY_TYPES: Record<EntityStoragePrimaryType, Type>;
    name: string;
    description: string;
    meta: any;
    type: ObjectType;
    instances: any[];
    methods: Record<string, Func>;
    key: Expression;
    keyType: Type;
    describe: Expression;
    transcoders: Record<string, EntityStorageTranscoder>;
    indexes: Record<string, EntityIndex>;
    primaryType: EntityStoragePrimaryType;
    constructor(options: EntityOptions, defs: Definitions);
    private decodeTranscoders;
    private decodeIndexes;
    encode(): EntityOptions;
    canStore(): boolean;
    renameProp(prop: string, newProp: string): void;
    removeProp(prop: string): void;
    getEntityProps(): EntityProps;
    getKey(run: Runtime, instance: any): any;
    getDescribe(run: Runtime, instance: any): any;
    getDecodedPropertyTypes(): TypeMap;
    getPropertyTypeFor(forProperty?: string): EnumType;
    getEncodedPropertyTypes(): TypeMap;
    getEncodedType(): ObjectType;
    getDecodedType(): ObjectType;
    getProperties(): string[];
    getPropertyType(): EnumType;
    getKeyReturnType(): Type<any>;
    getKeyContext(): Type;
    getDescribeContext(): Type;
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
    getPrimary(name?: string, returnDynamic?: boolean): EntityIndex | null;
    getUniqueIndexes(): EntityIndex[];
    addPrimary(props: string | string[]): this;
    addIndex(name: string, props: string[], unique?: boolean, primary?: boolean): this;
}
