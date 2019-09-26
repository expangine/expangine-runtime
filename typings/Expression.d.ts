import { Type, TypeMap } from './Type';
import { Definitions } from './Definitions';
export interface ExpressionProvider {
    getExpression(value: any): Expression;
}
export interface ExpressionClass<T extends Expression = any> {
    id: string;
    decode(this: ExpressionClass<T>, data: any[], exprs: ExpressionProvider): T;
    encode(this: ExpressionClass<T>, expr: T): any;
    new (...args: any[]): T;
}
export declare type ExpressionValue = any | Expression;
export declare type ExpressionMap = Record<string, Expression>;
export declare abstract class Expression {
    abstract getId(): string;
    abstract getScope(): TypeMap | null;
    abstract getComplexity(def: Definitions): number;
    abstract encode(): any;
    abstract getType(def: Definitions, context: Type): Type | null;
}
