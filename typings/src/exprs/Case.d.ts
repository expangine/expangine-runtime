import { Expression, ExpressionProvider } from '../Expression';
export declare class CaseExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): CaseExpression;
    static encode(expr: CaseExpression): any;
    cases: [Expression, Expression][];
    otherwise: Expression;
    constructor(cases: [Expression, Expression][], otherwise: Expression);
    encode(): any;
}
