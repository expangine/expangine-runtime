import { Expression, ExpressionProvider } from '../Expression';
import { Definitions } from '../Definitions';
export declare class OrExpression extends Expression {
    static id: string;
    static decode(data: any[], exprs: ExpressionProvider): OrExpression;
    static encode(expr: OrExpression): any;
    expressions: Expression[];
    constructor(expressions: Expression[]);
    getComplexity(def: Definitions): number;
    getScope(): null;
    encode(): any;
}
