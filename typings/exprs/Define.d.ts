import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { AnyType } from '../types/Any';
import { Definitions } from '../Definitions';
import { Type } from '../Type';
export declare class DefineExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): DefineExpression;
    static encode(expr: DefineExpression): any;
    define: ExpressionMap;
    body: Expression;
    constructor(define: ExpressionMap, body: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): Record<string, AnyType>;
    encode(): any;
    getType(def: Definitions, original: Type): Type | null;
    with(name: string, value: ExpressionValue): DefineExpression;
    with(defines: Record<string, ExpressionValue>): DefineExpression;
    run(expr: Expression): DefineExpression;
}
