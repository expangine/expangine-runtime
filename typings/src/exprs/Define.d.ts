import { Expression, ExpressionProvider } from '../Expression';
export declare class DefineExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): DefineExpression;
    static encode(expr: DefineExpression): any;
    define: Record<string, Expression>;
    body: Expression;
    constructor(define: Record<string, Expression>, body: Expression);
    encode(): any;
}
