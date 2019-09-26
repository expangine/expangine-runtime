import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
export interface BooleanOptions {
    true?: Record<string, true>;
    false?: Record<string, true>;
}
export declare class BooleanType extends Type<BooleanOptions> {
    static id: string;
    static operations: import("..").Operations;
    static baseType: BooleanType;
    static decode(data: any[], types: TypeProvider): BooleanType;
    static encode(type: BooleanType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: BooleanType, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(): null;
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    isCompatible(other: Type): boolean;
    getCreateExpression(ex: ExpressionBuilder): Expression;
    getValidateExpression(ex: ExpressionBuilder): Expression;
    getCompareExpression(ex: ExpressionBuilder): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): BooleanType;
    clone(): BooleanType;
    encode(): any;
    create(): boolean;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: boolean): boolean;
    toJson(value: boolean): boolean;
}
