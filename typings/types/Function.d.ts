import { Type, TypeProvider, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { ObjectType, ObjectOptions } from './Object';
import { Expression } from '../Expression';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Definitions } from '../Definitions';
import { Traverser } from '../Traverser';
export interface FunctionOptions {
    returnType: Type;
    params: ObjectType<ObjectOptions>;
    expression: Expression;
}
export declare class FunctionType extends Type<FunctionOptions> {
    static id: string;
    static operations: Operations;
    static baseType: FunctionType;
    static decode(data: any[], types: TypeProvider): FunctionType;
    static encode(type: FunctionType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    getId(): string;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any, any, any>>;
    merge(type: FunctionType, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(def: Definitions): TypeSub[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    traverse<R>(traverse: Traverser<Type, R>): R;
    setParent(parent?: Type): void;
    removeDescribedRestrictions(): void;
    getCreateExpression(ex: ExpressionBuilder): Expression;
    getValidateExpression(ex: ExpressionBuilder): Expression;
    getCompareExpression(ex: ExpressionBuilder): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): FunctionType;
    clone(): FunctionType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
