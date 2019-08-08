import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
export declare class IfExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): IfExpression;
    static encode(expr: IfExpression): any;
    cases: [Expression, Expression][];
    otherwise: Expression;
    constructor(cases: [Expression, Expression][], otherwise: Expression);
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
