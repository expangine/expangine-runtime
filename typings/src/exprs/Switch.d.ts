import { Expression, ExpressionProvider } from '../Expression';
export declare class SwitchExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): SwitchExpression;
    static encode(expr: SwitchExpression): any;
    value: Expression;
    op: string;
    cases: [Expression[], Expression][];
    defaultCase: Expression;
    constructor(value: Expression, op: string, cases: [Expression[], Expression][], defaultCase: Expression);
    getScope(): null;
    encode(): any;
}
