import { Type, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Expression } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Traverser } from '../Traverser';
export interface NumberOptions {
    min?: number;
    max?: number;
    whole?: boolean;
}
export declare class NumberType extends Type<NumberOptions> {
    static WHOLE_EPSILON: number;
    static id: string;
    static operations: import("..").Operations;
    static computeds: import("..").Computeds;
    static baseType: NumberType;
    static decode(data: any[]): NumberType;
    static encode(type: NumberType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider, cache: Map<any, Type>): Type | null;
    static registered: boolean;
    static EQUALS_EPSILON: number;
    static COMPARES_EPSILON: number;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("..").OperationGeneric>;
    merge(type: NumberType): void;
    getSubType(expr: Expression, def: DefinitionProvider, context: Type): Type | null;
    getSubTypes(def: DefinitionProvider): TypeSub[];
    getExactType(value: any): Type;
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
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): NumberType;
    clone(): NumberType;
    encode(): any;
    create(): number;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: number): number;
    toJson(value: number): number;
}
