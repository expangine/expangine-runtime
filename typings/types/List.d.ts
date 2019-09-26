import { Type, TypeProvider, TypeInput, TypeDescribeProvider } from '../Type';
import { NumberType } from './Number';
import { ObjectType } from './Object';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
export interface ListOptions {
    item: Type;
    min?: number;
    max?: number;
}
export declare class ListType extends Type<ListOptions> {
    static lengthType: NumberType;
    static id: string;
    static operations: import("..").Operations;
    static baseType: ListType;
    static decode(data: any[], types: TypeProvider): ListType;
    static encode(type: ListType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static forItem(itemOrClass: TypeInput): ListType;
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: ListType, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(): {
        length: NumberType;
        item: Type<any>;
    };
    getExactType(value: any): Type;
    isCompatible(other: Type): boolean;
    getCreateExpression(ex: ExpressionBuilder): Expression;
    getValidateExpression(ex: ExpressionBuilder): Expression;
    getCompareExpression(ex: ExpressionBuilder): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): ListType;
    clone(): ListType;
    encode(): any;
    create(): any[];
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any[]): any[];
    toJson(value: any[]): any[];
    getSplitResultType(): ObjectType;
    getIterationScope(): {
        list: ListType;
        item: Type<any>;
        index: NumberType;
    };
    static readonly IterationScopeDefaults: {
        list: string;
        item: string;
        index: string;
    };
    getCompareScope(): {
        list: ListType;
        value: Type<any>;
        test: Type<any>;
    };
    static readonly CompareScopeDefaults: {
        list: string;
        value: string;
        test: string;
    };
}
