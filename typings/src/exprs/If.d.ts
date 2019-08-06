import { Expression, ExpressionProvider } from '../Expression';
export declare class IfExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): IfExpression;
    static encode(expr: IfExpression): any;
    cases: [Expression, Expression][];
    otherwise: Expression;
    constructor(cases: [Expression, Expression][], otherwise: Expression);
    getScope(): null;
    encode(): any;
}
