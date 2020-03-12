import { ObjectType } from './types/Object';
import { Definitions } from './Definitions';
import { FuncOptions, Func } from './Func';
import { Type, TypeMap } from './Type';
import { Expression } from './Expression';
import { Runtime } from './Runtime';
import { EnumType } from './types/Enum';
import { Relation } from './Relation';
import { EventBase } from './EventBase';
export interface EntityOptions {
    name: string;
    created: number;
    updated: number;
    description: string;
    meta: any;
    type: any;
    instances: any[];
    primaryType?: EntityPrimaryType;
    key?: any;
    describe?: any;
    transcoders?: Record<string, EntityTranscoderOptions>;
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
export interface EntityTranscoder {
    encode: Expression;
    decode: Expression;
    encodedType: Type;
}
export interface EntityTranscoderOptions {
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
export declare enum EntityPrimaryType {
    GIVEN = 0,
    AUTO_INCREMENT = 1,
    UUID = 2
}
export interface EntityEvents {
    change(entity: Entity): void;
    renamed(entity: Entity, oldName: string): void;
    renameProp(entity: Entity, prop: string, oldProp: string): void;
    removeProp(entity: Entity, prop: string): void;
    sync(entity: Entity, options: EntityOptions, defs: Definitions): void;
    addTranscoder(entity: Entity, prop: string, transcoder: EntityTranscoder): void;
    removeTranscoder(entity: Entity, prop: string, transcoder: EntityTranscoder): void;
    updateTranscoder(enitty: Entity, prop: string, transcoder: EntityTranscoder, oldTranscoder: EntityTranscoder): void;
    addIndex(entity: Entity, index: EntityIndex): void;
    removeIndex(entity: Entity, index: EntityIndex): void;
    updateIndex(entity: Entity, index: EntityIndex, oldIndex: EntityIndex): void;
    addMethod(entity: Entity, method: Func): void;
    removeMethod(entity: Entity, method: Func): void;
    updateMethod(entity: Entity, method: Func, oldMethod: Func): void;
}
export declare class Entity extends EventBase<EntityEvents> implements EntityOptions {
    static create(defs: Definitions, defaults?: Partial<EntityOptions>): Entity;
    static METHOD_THIS: string;
    static uuid(): string;
    static PRIMARY_TYPES: Record<EntityPrimaryType, Type>;
    name: string;
    created: number;
    updated: number;
    description: string;
    meta: any;
    type: ObjectType;
    instances: any[];
    methods: Record<string, Func>;
    key: Expression;
    keyType: Type;
    describe: Expression;
    transcoders: Record<string, EntityTranscoder>;
    indexes: Record<string, EntityIndex>;
    primaryType: EntityPrimaryType;
    constructor(options: EntityOptions, defs: Definitions);
    sync(options: EntityOptions, defs: Definitions): void;
    hasChanges(options: EntityOptions): boolean;
    changed(): void;
    private decodeMethods;
    private decodeMethod;
    private decodeTranscoders;
    private decodeTranscoder;
    private decodeIndexes;
    encode(): EntityOptions;
    canStore(defs: Definitions): boolean;
    updateKeyType(defs: Definitions): void;
    renameProp(prop: string, newProp: string): void;
    removeProp(prop: string): void;
    getEntityProps(): EntityProps;
    getKey(run: Runtime, instance: any): any;
    setKey(instance: any): void;
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
    getEncodeExpected(forProperty?: string, defaultType?: Type): Type<any>;
    getDecoded(run: Runtime, encoded: any): any;
    getDecodedValue(run: Runtime, instance: any, property: string): any;
    getDecodeContext(forProperty?: string, overrideValueType?: Type): ObjectType;
    getDecodeExpected(forProperty?: string): Type<any>;
    getIndexExpectedType(): import(".").SetType;
    getDynamicPrimaryKey(): string;
    getPrimaryKeyExpression(separator?: string, name?: string): import(".").PathExpression | import(".").OperationExpression<"list", "toText" | "prefix" | "suffix" | "delimiter", "list" | "item" | "index">;
    getPrimary(name?: string, returnDynamic?: boolean): EntityIndex | null;
    getUniqueIndexes(): EntityIndex[];
    addPrimary(props: string | string[]): this;
    addIndex(name: string, options: EntityIndexOptions, delayChange?: boolean): this;
    updateIndex(name: string, delayChange?: boolean): this;
    removeIndex(name: string, delayChange?: boolean): this;
    renameIndex(name: string, newName: string): this;
    addTranscoder(defs: Definitions, prop: string, options: EntityTranscoderOptions | EntityTranscoder, delayChange?: boolean): this;
    removeTranscoder(name: string, delayChange?: boolean): this;
    updateTranscoder(name: string, delayChange?: boolean): this;
    addMethod(method: Func, delayChange?: boolean): this;
    renameMethod(name: string, newName: string, delayChange?: boolean): this;
    removeMethod(name: string, delayChange?: boolean): this;
}
