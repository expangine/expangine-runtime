import { Expression, ExpressionProvider } from '../Expression';
export declare class VariableExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): VariableExpression;
    static encode(expr: VariableExpression): any;
    path: Expression[];
    constructor(path: Expression[]);
    encode(): any;
}
