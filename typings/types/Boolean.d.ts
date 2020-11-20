import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser } from '../Traverser';
export interface BooleanOptions {
    true?: Record<string, true>;
    false?: Record<string, true>;
}
export declare class BooleanType extends Type<boolean, BooleanOptions> {
    static id: string;
    static operations: import("..").Operations;
    static computeds: import("..").Computeds;
    static baseType: BooleanType;
    static decode(data: any[], types: TypeProvider): BooleanType;
    static encode(type: BooleanType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | undefined;
    static registered: boolean;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("..").OperationGeneric>;
    merge(type: BooleanType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | undefined;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getExactType(value: boolean): Type;
    getSimplifiedType(): Type;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    isOptional(): boolean;
    isSimple(): boolean;
    traverse<R>(traverse: Traverser<Type, R>): R;
    setParent(parent?: Type): void;
    removeDescribedRestrictions(): void;
    getCreateExpression(): Expression;
    getValidateExpression(): Expression;
    getCompareExpression(): Expression;
    isValid(value: any): value is boolean;
    normalize(value: any): any;
    newInstance(): BooleanType;
    clone(): BooleanType;
    encode(): any;
    create(): boolean;
    random(rnd: (a: number, b: number, whole: boolean) => number): boolean;
    fromJson(json: boolean): boolean;
    toJson(value: boolean): boolean;
}
