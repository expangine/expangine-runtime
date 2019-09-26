import { Type, TypeProvider, TypeDescribeProvider, TypeInputMap, TypeMap } from '../Type';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { TextType } from './Text';
import { Traverser } from '../Traverser';
export interface ObjectOptions {
    props: TypeMap;
}
export declare class ObjectType extends Type<ObjectOptions> {
    static propType: TextType;
    static id: string;
    static operations: import("..").Operations;
    static baseType: ObjectType;
    static decode(data: any[], types: TypeProvider): ObjectType;
    static encode(type: ObjectType): any;
    static describePriority: number;
    static describe(data: any, describer: TypeDescribeProvider): Type | null;
    static from(types?: TypeInputMap): ObjectType;
    getId(): string;
    getOperations(): Record<string, import("..").Operation<any, any, any, any, any>>;
    merge(type: ObjectType, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(): [TypeMap, Type[]];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    traverse<R>(traverse: Traverser<Type, R>): R;
    isCompatible(other: Type): boolean;
    getCreateExpression(ex: ExpressionBuilder): Expression;
    getValidateExpression(ex: ExpressionBuilder): Expression;
    getCompareExpression(ex: ExpressionBuilder): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): ObjectType;
    clone(): ObjectType;
    encode(): any;
    create(): any;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: any): any;
    toJson(value: any): any;
}
