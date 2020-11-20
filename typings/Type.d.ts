import { Operations, OperationGeneric } from './Operation';
import { Expression } from './Expression';
import { DefinitionProvider } from './DefinitionProvider';
import { Traverser, Traversable, TraverseStep } from './Traverser';
import { Computeds } from './Computed';
import { ReferenceData } from './ReferenceData';
export declare type TypeInput = TypeClass | Type;
export declare type TypeInputFor<T> = TypeClass<Type<T>, T> | Type<T>;
export declare type TypeInputType<I> = I extends TypeClass & {
    baseType: {
        create(): infer D1;
    };
} ? D1 : I extends Type & {
    create(): infer D2;
} ? D2 : unknown;
export declare type TypeInputTypeArray<T extends TypeInput[]> = {
    [K in keyof T]: TypeInputType<T[K]>;
}[keyof T];
export declare type TypeInputTypeElements<T extends any[]> = {
    [K in keyof T]: TypeInputType<T[K]>;
};
export declare type TypeInputTypeObject<T extends TypeInputMap> = UndefinedToOptional<{
    [K in keyof T]: TypeInputType<T[K]>;
}>;
export declare type TypeInputMap = Record<string, TypeInput>;
export declare type UndefinedToOptional<T> = [OptionalPropertyNames<T>] extends [never] ? T : [RequiredPropertyNames<T>] extends [never] ? Partial<T> : (Partial<Pick<T, OptionalPropertyNames<T>>> & Pick<T, RequiredPropertyNames<T>>);
export declare type OptionalPropertyNames<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];
export declare type RequiredPropertyNames<T> = {
    [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];
export declare type TypeMap = Record<string, Type>;
export declare type TypeMapInput = Record<string, Type | undefined>;
export declare type TypeMapFor<T> = {
    [K in keyof T]: Type<T[K]>;
};
export declare type TypeChild = string | number;
export interface TypeSub {
    key: string | number | Type;
    value: Type;
}
export declare type TypeResolved<T> = T extends (null | undefined) ? undefined : T extends TypeInput ? Type : T extends TypeInput[] ? Type[] : T extends TypeInputMap ? Record<keyof T, Type> : {
    [K in keyof T]: TypeResolved<T[K]>;
};
export interface TypeProvider {
    getType(data: any, otherwise?: Type): Type;
    getExpression(data: any): Expression;
    isExpression(value: any): value is (Expression | [string, ...any[]]);
    getData(name: string): ReferenceData | undefined;
    setLegacy(): void;
}
export interface TypeDescribeProvider {
    describe(data: any): Type;
    merge(type: Type, data: any): Type;
}
export interface TypeCompatibleOptions {
    strict?: boolean;
    value?: boolean;
    exact?: boolean;
}
export interface TypeParser {
    (data: any, types: TypeProvider): Type;
}
export interface TypeClass<T extends Type<D, O> = any, D = any, O = any> {
    id: string;
    operations: Operations;
    computeds: Computeds;
    baseType: T;
    decode(this: TypeClass<T>, data: any[], types: TypeProvider): T;
    encode(this: TypeClass<T>, type: T): any;
    describePriority: number;
    describe(this: TypeClass<T>, data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type<D, O> | undefined;
    register(this: TypeClass<T>): void;
    registered: boolean;
    new (options: O, ...args: any[]): T;
}
export declare abstract class Type<D = any, O = any> implements Traversable<Type> {
    options: O;
    parent?: Type;
    constructor(options: O);
    abstract getOperations(): Record<string, OperationGeneric>;
    abstract getId(): string;
    abstract merge(type: this): void;
    abstract getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | undefined;
    abstract getSubTypes(def: DefinitionProvider): TypeSub[];
    getChildType(name: TypeChild): Type | undefined;
    getChildTypes(): TypeChild[];
    getParentOfType<T extends Type, R = any>(type: TypeClass<T, R>): T | undefined;
    abstract getExactType(value: D): Type;
    abstract getSimplifiedType(): Type;
    getRequired(): Type;
    isWrapper(): boolean;
    getWrappedType(): Type;
    protected abstract isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    isCompatible(other: Type, options?: TypeCompatibleOptions): boolean;
    protected acceptsOtherTypes(): boolean;
    acceptsType(other: Type): boolean;
    acceptsData(other: Type): boolean;
    exactType(other: Type): boolean;
    exactData(other: Type): boolean;
    abstract isOptional(): boolean;
    abstract isSimple(): boolean;
    abstract traverse<R>(traverse: Traverser<Type, R>): R;
    abstract setParent(parent?: Type): void;
    abstract removeDescribedRestrictions(): void;
    abstract getCreateExpression(): Expression;
    abstract getValidateExpression(): Expression;
    abstract getCompareExpression(): Expression;
    getValueChangeExpression(newValue: Expression, from?: TraverseStep, to?: TraverseStep): Expression;
    getValueChangeAt(newValue: Expression): Expression;
    getPath(): TraverseStep[];
    getTypeFromPath(path: TraverseStep[]): Type | undefined;
    getTypeFromStep(step: TraverseStep): Type | undefined;
    getRootType(): Type;
    abstract isValid(value: any): value is D;
    abstract normalize(value: any): any;
    abstract newInstance(): Type<D>;
    abstract clone(): Type<D>;
    abstract encode(): any;
    abstract create(): D;
    abstract random(rnd: (a: number, b: number, whole: boolean) => number): D;
    abstract fromJson(json: any): D;
    abstract toJson(value: D): any;
}
