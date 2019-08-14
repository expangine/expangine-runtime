import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
export declare class SwitchExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): SwitchExpression;
    static encode(expr: SwitchExpression): any;
    value: Expression;
    op: string;
    cases: [Expression[], Expression][];
    defaultCase: Expression;
    constructor(value: Expression, op: string, cases: [Expression[], Expression][], defaultCase: Expression);
    getId(): string;
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
