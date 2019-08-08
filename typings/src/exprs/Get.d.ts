import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
export declare class GetExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): GetExpression;
    static encode(expr: GetExpression): any;
    path: Expression[];
    constructor(path: Expression[]);
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
