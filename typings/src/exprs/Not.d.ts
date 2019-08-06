import { Expression, ExpressionProvider } from '../Expression';
export declare class NotExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): NotExpression;
    static encode(expr: NotExpression): any;
    expression: Expression;
    constructor(expression: Expression);
    getScope(): null;
    encode(): any;
}
