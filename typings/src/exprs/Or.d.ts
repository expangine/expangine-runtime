import { Expression, ExpressionProvider } from '../Expression';
export declare class OrExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): OrExpression;
    static encode(expr: OrExpression): any;
    expressions: Expression[];
    constructor(expressions: Expression[]);
    encode(): any;
}
