import { Type } from './Type';
import { Definitions } from './Definitions';
import { ConstantExpression } from './exprs/Constant';
export interface ExpressionProvider {
    getExpression(value: any): Expression;
}
export interface ExpressionClass<T extends Expression = any> {
    id: string;
    decode(this: ExpressionClass<T>, data: any[], exprs: ExpressionProvider): T;
    encode(this: ExpressionClass<T>, expr: T): any;
    new (...args: any[]): T;
}
export declare abstract class Expression {
    static hasConstant(e: Expression, constant: any): boolean;
    static isConstant(e: Expression): e is ConstantExpression;
    id: string;
    constructor(id: string);
    abstract getScope(): Record<string, Type> | null;
    abstract getComplexity(def: Definitions): number;
    abstract encode(): any;
}
