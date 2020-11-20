import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions, TypeChild } from '../Type';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser } from '../Traverser';
import { Operations } from '../Operation';
import { Computeds } from '../Computed';
import { FunctionType } from './Function';
export interface GenericOptions {
    path: TypeChild[];
    base?: Type;
}
export declare class GenericType extends Type<any, GenericOptions> {
    static id: string;
    static operations: Operations;
    static computeds: Computeds;
    static baseType: GenericType;
    static decode(data: any[], types: TypeProvider): GenericType;
    static encode(type: GenericType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | undefined;
    static registered: boolean;
    static register(): void;
    getFunction(): FunctionType | undefined;
    getResolvedType(): Type;
    getId(): string;
    getOperations(): Record<string, import("../Operation").OperationGeneric>;
    merge(type: GenericType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | undefined;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getChildType(name: TypeChild): Type | undefined;
    getChildTypes(): TypeChild[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    isWrapper(): boolean;
    getWrappedType(): Type;
    isCompatible(other: Type): boolean;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    isOptional(): boolean;
    isSimple(): boolean;
    traverse<R>(traverse: Traverser<Type, R>): R;
    setParent(parent?: Type): void;
    removeDescribedRestrictions(): void;
    getCreateExpression(): Expression;
    getValidateExpression(): Expression;
    getCompareExpression(): Expression;
    isValid(value: any): value is any;
    normalize(value: any): any;
    newInstance(): GenericType;
    clone(): GenericType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
