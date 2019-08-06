import { Expression, ExpressionProvider } from '../Expression';
export declare class ChainExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): ChainExpression;
    static encode(expr: ChainExpression): any;
    chain: Expression[];
    constructor(chain: Expression[]);
    encode(): any;
}
