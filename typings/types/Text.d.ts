import { Type, TypeDescribeProvider, TypeMap } from '../Type';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { NumberType } from './Number';
import { Definitions } from '../Definitions';
export interface TextOptions {
    min?: number;
    max?: number;
    requireUpper?: boolean;
    requireLower?: boolean;
    forceUpper?: boolean;
    forceLower?: boolean;
    matches?: RegExp;
}
export declare class TextType extends Type<TextOptions> {
    static lengthType: NumberType;
    static indexType: NumberType;
    static id: string;
    static operations: import("..").Operations;
    static baseType: TextType;
    static decode(data: any[]): TextType;
    static encode(type: TextType): any;
    private static decodeOptions;
    private static encodeOptions;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: TextType, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(): [TypeMap, Type[]];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    isCompatible(other: Type): boolean;
    getCreateExpression(ex: ExpressionBuilder): Expression;
    getValidateExpression(ex: ExpressionBuilder): Expression;
    getCompareExpression(ex: ExpressionBuilder): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): TextType;
    clone(): TextType;
    encode(): any;
    create(): string;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: string): string;
    toJson(value: string): string;
}
