import { Expression, ExpressionProvider } from '../Expression';
export declare class GetExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): GetExpression;
    static encode(expr: GetExpression): any;
    path: Expression[];
    constructor(path: Expression[]);
    getScope(): null;
    encode(): any;
}
