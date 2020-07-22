import { Operations, OperationGeneric } from './Operation';
import { Expression } from './Expression';
import { DefinitionProvider } from './DefinitionProvider';
import { Traverser, Traversable, TraverseStep } from './Traverser';
import { Computeds } from './Computed';
import { ReferenceData } from './ReferenceData';
export declare type TypeInput = TypeClass | Type;
export declare type TypeInputMap = Record<string, TypeInput>;
export declare type TypeMap = Record<string, Type>;
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
    getData(name: string): ReferenceData | null;
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
export interface TypeClass<T extends Type<O> = any, O = any> {
    id: string;
    operations: Operations;
    computeds: Computeds;
    baseType: T;
    decode(this: TypeClass<T>, data: any[], types: TypeProvider): T;
    encode(this: TypeClass<T>, type: T): any;
    describePriority: number;
    describe(this: TypeClass<T>, data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | null;
    register(this: TypeClass<T>): void;
    registered: boolean;
    new (options: O, ...args: any[]): T;
}
export declare abstract class Type<O = any> implements Traversable<Type> {
    options: O;
    parent: Type;
    constructor(options: O);
    abstract getOperations(): Record<string, OperationGeneric>;
    abstract getId(): string;
    abstract merge(type: Type<O>): void;
    abstract getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;
    abstract getSubTypes(def: DefinitionProvider): TypeSub[];
    abstract getExactType(value: any): Type<O>;
    abstract getSimplifiedType(): Type;
    getRequired(): Type;
    isWrapper(): boolean;
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
    getTypeFromPath(path: TraverseStep[]): Type | null;
    getTypeFromStep(step: TraverseStep): Type | null;
    getRootType(): Type;
    abstract isValid(value: any): boolean;
    abstract normalize(value: any): any;
    abstract newInstance(): Type<O>;
    abstract clone(): Type<O>;
    abstract encode(): any;
    abstract create(): any;
    abstract random(rnd: (a: number, b: number, whole: boolean) => number): any;
    abstract fromJson(json: any): any;
    abstract toJson(value: any): any;
}
