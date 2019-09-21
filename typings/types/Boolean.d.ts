import { Type, TypeProvider, TypeDescribeProvider } from '../Type';
import { Operations } from '../Operation';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
export interface BooleanOptions {
    true?: Record<string, true>;
    false?: Record<string, true>;
}
export declare class BooleanType extends Type<BooleanOptions> {
    static id: string;
    static operations: Operations;
    static baseType: BooleanType;
    static decode(data: any[], types: TypeProvider): BooleanType;
    static encode(type: BooleanType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getId(): string;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any>>;
    merge(type: BooleanType, describer: TypeDescribeProvider): void;
    getSubTypes(): null;
    getExactType(value: any): Type;
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
