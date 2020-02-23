import { Type, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
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
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static registered: boolean;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: NumberType): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(def: Definitions): TypeSub[];
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
