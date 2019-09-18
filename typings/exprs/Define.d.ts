import { Expression, ExpressionProvider, ExpressionValue } from '../Expression';
import { AnyType } from '../types/Any';
import { Definitions } from '../Definitions';
export declare class DefineExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): DefineExpression;
    static encode(expr: DefineExpression): any;
    define: Record<string, Expression>;
    body: Expression;
    constructor(define: Record<string, Expression>, body: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): Record<string, AnyType>;
    encode(): any;
    with(name: string, value: ExpressionValue): DefineExpression;
    with(defines: Record<string, ExpressionValue>): DefineExpression;
    run(expr: Expression): DefineExpression;
}
